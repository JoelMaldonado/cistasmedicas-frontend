<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Appointment, AppointmentStatus } from '@/types/appointment.types'
import type { DoctorSlot } from '@/types/slot.types'
import { slotsService } from '@/services/slots.service'
import { useAppointments } from '@/composables/useAppointments'
import StatusBadge from '@/components/appointments/StatusBadge.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const STATUS_OPTIONS: Array<{ label: string; value: AppointmentStatus | null }> = [
  { label: 'Todos los estados', value: null },
  { label: 'Pendiente', value: 'pending' },
  { label: 'Confirmada', value: 'confirmed' },
  { label: 'Rechazada', value: 'rejected' },
  { label: 'Cancelada', value: 'cancelled' },
  { label: 'Completada', value: 'completed' },
]

const { appointments, isLoading, ensureLoaded, confirmAppointment, rejectAppointment, cancelAppointment, rescheduleAppointment } =
  useAppointments()

onMounted(ensureLoaded)

const statusFilter = ref<AppointmentStatus | null>(null)

const filteredAppointments = computed(() =>
  statusFilter.value ? appointments.value.filter((apt) => apt.status === statusFilter.value) : appointments.value,
)

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
  appointmentToReschedule.value = appointment
  selectedNewSlotId.value = null
  showRescheduleDialog.value = true
  const slots = await slotsService.getByDoctor(appointment.doctorId)
  rescheduleOptions.value = slots.filter((slot) => slot.status === 'available')
}

async function handleReschedule() {
  if (!appointmentToReschedule.value || !selectedNewSlotId.value) return
  const slot = rescheduleOptions.value.find((item) => item.id === selectedNewSlotId.value)
  if (!slot) return

  isRescheduling.value = true
  try {
    await rescheduleAppointment(appointmentToReschedule.value.id, {
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    })
    showRescheduleDialog.value = false
  } finally {
    isRescheduling.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Mis citas</h1>
      <p>Gestiona las solicitudes y citas de tus pacientes.</p>
    </div>

    <div class="filter-bar">
      <Select v-model="statusFilter" :options="STATUS_OPTIONS" option-label="label" option-value="value" placeholder="Filtrar por estado" />
    </div>

    <EmptyState
      v-if="!isLoading && filteredAppointments.length === 0"
      icon="pi pi-calendar-times"
      title="No hay citas con este filtro"
    />

    <DataTable v-else :value="filteredAppointments" :loading="isLoading" paginator :rows="8" data-key="id">
      <Column field="patientName" header="Paciente" />
      <Column field="date" header="Fecha" />
      <Column header="Hora">
        <template #body="{ data }">{{ data.startTime }} - {{ data.endTime }}</template>
      </Column>
      <Column field="reason" header="Motivo" />
      <Column header="Estado">
        <template #body="{ data }"><StatusBadge :status="data.status" /></template>
      </Column>
      <Column header="Acciones">
        <template #body="{ data }">
          <div class="row-actions">
            <template v-if="data.status === 'pending'">
              <Button label="Confirmar" size="small" severity="success" @click="openAction('confirm', data)" />
              <Button label="Rechazar" size="small" severity="danger" text @click="openAction('reject', data)" />
            </template>
            <template v-else-if="data.status === 'confirmed'">
              <Button label="Reagendar" size="small" severity="info" text @click="openReschedule(data)" />
              <Button label="Cancelar" size="small" severity="danger" text @click="openAction('cancel', data)" />
            </template>
          </div>
        </template>
      </Column>
    </DataTable>

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
.filter-bar {
  margin-bottom: 1rem;
  max-width: 260px;
}

.row-actions {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.reschedule-info {
  color: #64748b;
  margin: 0 0 1rem;
}
</style>
