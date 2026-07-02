<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { Appointment, AppointmentStatus } from '@/types/appointment.types'
import type { DoctorSlot } from '@/types/slot.types'
import { slotsService } from '@/services/slots.service'
import { useAppointments } from '@/composables/useAppointments'
import { getEffectiveStatus } from '@/utils/appointmentStatus'
import StatusBadge from '@/components/appointments/StatusBadge.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

// Debe reflejar la misma ventana/horario que genera el backend (appointments.service.ts)
const BOOKING_WINDOW_DAYS = 7
const WORK_START_HOUR = 8
const WORK_END_HOUR = 17

const toast = useToast()

const { appointments, isLoading, ensureLoaded, confirmAppointment, rejectAppointment, cancelAppointment, rescheduleAppointment } =
  useAppointments()

onMounted(ensureLoaded)

function pad(value: number): string {
  return value.toString().padStart(2, '0')
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const weekDays = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days: Array<{ date: string; weekday: string; dayNumber: string; isToday: boolean }> = []

  for (let offset = 0; offset <= BOOKING_WINDOW_DAYS; offset++) {
    const current = new Date(today)
    current.setDate(today.getDate() + offset)

    if (current.getDay() === 0) continue // domingo: sin atención

    days.push({
      date: toDateKey(current),
      weekday: current.toLocaleDateString('es-PE', { weekday: 'short' }),
      dayNumber: current.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
      isToday: offset === 0,
    })
  }

  return days
})

const hours = computed(() => {
  const rows: string[] = []
  for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour++) {
    rows.push(`${pad(hour)}:00`)
  }
  return rows
})

// Rechazadas/canceladas liberan el horario: no deben "ocupar" ninguna celda del calendario
const activeAppointments = computed(() =>
  appointments.value.filter((apt) => apt.status !== 'rejected' && apt.status !== 'cancelled'),
)

const appointmentByCell = computed(() => {
  const map = new Map<string, Appointment>()
  for (const apt of activeAppointments.value) {
    map.set(`${apt.date}|${apt.startTime}`, apt)
  }
  return map
})

function cellAppointment(date: string, hour: string): Appointment | null {
  return appointmentByCell.value.get(`${date}|${hour}`) ?? null
}

function isPastCell(date: string, hour: string): boolean {
  return new Date(`${date}T${hour}:00`).getTime() < Date.now()
}

function formatFullDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })
}

// Popover de la celda: qué cita se seleccionó y en qué botón se hizo click
const popover = ref()
const selectedAppointment = ref<Appointment | null>(null)

function openCellPopover(event: Event, appointment: Appointment) {
  selectedAppointment.value = appointment
  popover.value?.toggle(event)
}

type ActionType = 'confirm' | 'reject' | 'cancel'

const actionDialog = ref<{ type: ActionType; appointment: Appointment } | null>(null)
const isProcessingAction = ref(false)

const ACTION_CONFIG: Record<ActionType, { title: string; message: (apt: Appointment) => string; confirmLabel: string; severity: 'success' | 'danger' | 'warn' }> = {
  confirm: {
    title: 'Confirmar cita',
    message: (apt) => `¿Confirmas la cita con ${apt.patientName}?`,
    confirmLabel: 'Confirmar',
    severity: 'success',
  },
  reject: {
    title: 'Rechazar cita',
    message: (apt) => `¿Seguro que deseas rechazar la cita con ${apt.patientName}?`,
    confirmLabel: 'Rechazar',
    severity: 'danger',
  },
  cancel: {
    title: 'Cancelar cita',
    message: (apt) => `¿Seguro que deseas cancelar la cita con ${apt.patientName}?`,
    confirmLabel: 'Sí, cancelar',
    severity: 'danger',
  },
}

const showActionDialog = computed({
  get: () => actionDialog.value !== null,
  set: (value: boolean) => {
    if (!value) actionDialog.value = null
  },
})

function openAction(type: ActionType, appointment: Appointment) {
  popover.value?.hide()
  actionDialog.value = { type, appointment }
}

async function handleActionConfirm() {
  if (!actionDialog.value) return
  const { type, appointment } = actionDialog.value
  isProcessingAction.value = true
  try {
    if (type === 'confirm') await confirmAppointment(appointment.id)
    if (type === 'reject') await rejectAppointment(appointment.id)
    if (type === 'cancel') await cancelAppointment(appointment.id)
    actionDialog.value = null
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: error instanceof Error ? error.message : 'No se pudo procesar la cita.',
      life: 4000,
    })
  } finally {
    isProcessingAction.value = false
  }
}

const showRescheduleDialog = ref(false)
const appointmentToReschedule = ref<Appointment | null>(null)
const rescheduleOptions = ref<DoctorSlot[]>([])
const selectedNewSlotId = ref<string | null>(null)
const isRescheduling = ref(false)

async function openReschedule(appointment: Appointment) {
  popover.value?.hide()
  appointmentToReschedule.value = appointment
  selectedNewSlotId.value = null
  rescheduleOptions.value = []
  showRescheduleDialog.value = true
  try {
    const slots = await slotsService.getByDoctor(appointment.doctorId)
    rescheduleOptions.value = slots.filter((slot) => slot.status === 'available')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: error instanceof Error ? error.message : 'No se pudieron cargar los horarios disponibles.',
      life: 4000,
    })
  }
}

async function handleReschedule() {
  if (!appointmentToReschedule.value || !selectedNewSlotId.value) return
  const slot = rescheduleOptions.value.find((item) => item.id === selectedNewSlotId.value)
  if (!slot) return

  isRescheduling.value = true
  try {
    await rescheduleAppointment(appointmentToReschedule.value.id, slot)
    showRescheduleDialog.value = false
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: error instanceof Error ? error.message : 'No se pudo reagendar la cita.',
      life: 4000,
    })
  } finally {
    isRescheduling.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Mi agenda</h1>
      <p>Semana en curso · haz clic en una cita para gestionarla.</p>
    </div>

    <div class="legend">
      <span class="legend__item"><i class="legend__dot legend__dot--pending" />Pendiente</span>
      <span class="legend__item"><i class="legend__dot legend__dot--confirmed" />Confirmada</span>
      <span class="legend__item"><i class="legend__dot legend__dot--completed" />Completada</span>
      <span class="legend__item"><i class="legend__dot legend__dot--free" />Libre</span>
    </div>

    <div class="calendar-scroll">
      <div class="calendar" :style="{ '--day-count': weekDays.length }">
        <div class="calendar__corner" />
        <div v-for="day in weekDays" :key="day.date" class="calendar__day-header" :class="{ 'calendar__day-header--today': day.isToday }">
          <span class="calendar__weekday">{{ day.weekday }}</span>
          <span class="calendar__day-number">{{ day.dayNumber }}</span>
        </div>

        <template v-for="hour in hours" :key="hour">
          <div class="calendar__hour-label">{{ hour }}</div>
          <template v-for="day in weekDays" :key="`${day.date}-${hour}`">
            <button
              v-if="cellAppointment(day.date, hour)"
              type="button"
              class="cell cell--occupied"
              :class="`cell--${getEffectiveStatus(cellAppointment(day.date, hour)!)}`"
              @click="openCellPopover($event, cellAppointment(day.date, hour)!)"
            >
              <span v-if="getEffectiveStatus(cellAppointment(day.date, hour)!) === 'pending'" class="cell__pulse" />
              <span class="cell__patient">{{ cellAppointment(day.date, hour)!.patientName }}</span>
            </button>
            <div v-else class="cell cell--empty" :class="{ 'cell--past': isPastCell(day.date, hour) }" />
          </template>
        </template>
      </div>
    </div>

    <Popover ref="popover">
      <div v-if="selectedAppointment" class="popover-content">
        <p class="popover-content__patient">{{ selectedAppointment.patientName }}</p>
        <p class="popover-content__meta">
          {{ formatFullDate(selectedAppointment.date) }} · {{ selectedAppointment.startTime }} - {{ selectedAppointment.endTime }}
        </p>
        <p v-if="selectedAppointment.reason" class="popover-content__reason">{{ selectedAppointment.reason }}</p>
        <StatusBadge :status="getEffectiveStatus(selectedAppointment)" />

        <div class="popover-content__actions">
          <template v-if="getEffectiveStatus(selectedAppointment) === 'pending'">
            <Button label="Aceptar" size="small" severity="success" @click="openAction('confirm', selectedAppointment)" />
            <Button label="Rechazar" size="small" severity="danger" text @click="openAction('reject', selectedAppointment)" />
          </template>
          <template v-else-if="getEffectiveStatus(selectedAppointment) === 'confirmed'">
            <Button label="Reagendar" size="small" severity="info" text @click="openReschedule(selectedAppointment)" />
            <Button label="Cancelar" size="small" severity="danger" text @click="openAction('cancel', selectedAppointment)" />
          </template>
        </div>
      </div>
    </Popover>

    <ConfirmDialog
      v-if="actionDialog"
      v-model:visible="showActionDialog"
      :title="ACTION_CONFIG[actionDialog.type].title"
      :message="ACTION_CONFIG[actionDialog.type].message(actionDialog.appointment)"
      :confirm-label="ACTION_CONFIG[actionDialog.type].confirmLabel"
      :severity="ACTION_CONFIG[actionDialog.type].severity"
      :loading="isProcessingAction"
      @confirm="handleActionConfirm"
      @cancel="actionDialog = null"
    />

    <Dialog v-model:visible="showRescheduleDialog" modal header="Reagendar cita" :style="{ width: '420px' }">
      <p class="reschedule-info">Selecciona un nuevo horario disponible para {{ appointmentToReschedule?.patientName }}.</p>
      <Select
        v-model="selectedNewSlotId"
        :options="rescheduleOptions"
        option-label="date"
        option-value="id"
        placeholder="Selecciona un horario"
        fluid
      >
        <template #option="{ option }">{{ option.date }} · {{ option.startTime }} - {{ option.endTime }}</template>
      </Select>
      <template #footer>
        <Button label="Cancelar" text severity="secondary" @click="showRescheduleDialog = false" />
        <Button label="Confirmar" :disabled="!selectedNewSlotId" :loading="isRescheduling" @click="handleReschedule" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1rem;
}

.legend__item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: #475569;
}

.legend__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.legend__dot--pending {
  background: #d97706;
}

.legend__dot--confirmed {
  background: #059669;
}

.legend__dot--completed {
  background: #94a3b8;
}

.legend__dot--free {
  background: #ffffff;
  border: 1px solid #cbd5e1;
}

.calendar-scroll {
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.calendar {
  display: grid;
  grid-template-columns: 64px repeat(var(--day-count), minmax(120px, 1fr));
  gap: 4px;
  min-width: 760px;
}

.calendar__corner {
  position: sticky;
  left: 0;
  background: #f8fafc;
}

.calendar__day-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0.25rem;
  border-radius: 8px;
  background: #f8fafc;
}

.calendar__day-header--today {
  background: #e0f2fe;
}

.calendar__weekday {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: capitalize;
}

.calendar__day-number {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
  text-transform: capitalize;
}

.calendar__hour-label {
  position: sticky;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  color: #64748b;
  background: #f8fafc;
  border-radius: 6px;
}

.cell {
  position: relative;
  min-height: 52px;
  border-radius: 8px;
  border: none;
  padding: 0.35rem 0.4rem;
  font-family: inherit;
  text-align: left;
  cursor: default;
}

.cell--empty {
  background: #f8fafc;
  border: 1px dashed #e2e8f0;
}

.cell--past {
  background: #f1f5f9;
}

.cell--occupied {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.cell--occupied:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.12);
}

.cell--pending {
  background: #fef3c7;
  border: 1px solid #f59e0b;
}

.cell--confirmed {
  background: #d1fae5;
  border: 1px solid #10b981;
}

.cell--completed {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  cursor: default;
}

.cell__patient {
  font-size: 0.78rem;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell__pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d97706;
  flex-shrink: 0;
  animation: pulse 1.6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgb(217 119 6 / 0.55);
  }
  50% {
    box-shadow: 0 0 0 5px rgb(217 119 6 / 0);
  }
}

.popover-content {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-width: 260px;
}

.popover-content__patient {
  margin: 0;
  font-weight: 700;
  color: #0f172a;
}

.popover-content__meta {
  margin: 0;
  font-size: 0.85rem;
  color: #475569;
  text-transform: capitalize;
}

.popover-content__reason {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
}

.popover-content__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.4rem;
  flex-wrap: wrap;
}

.reschedule-info {
  color: #64748b;
  margin: 0 0 1rem;
}
</style>
