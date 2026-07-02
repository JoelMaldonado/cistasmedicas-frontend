<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  doctor: 'Médico',
  patient: 'Paciente',
}

const { user, role, logout } = useAuth()

const roleLabel = computed(() => ROLE_LABELS[role.value ?? ''] ?? '')

const initials = computed(() => {
  if (!user.value?.fullName) return '?'
  return user.value.fullName
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
})
</script>

<template>
  <header class="topbar">
    <div />
    <div class="topbar__user">
      <Avatar :label="initials" shape="circle" style="background: #0284c7; color: #fff" />
      <div class="topbar__user-info">
        <span class="topbar__name">{{ user?.fullName }}</span>
        <span class="topbar__role">{{ roleLabel }}</span>
      </div>
      <Button icon="pi pi-sign-out" label="Salir" text severity="secondary" @click="logout" />
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.topbar__user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.topbar__name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1e293b;
}

.topbar__role {
  font-size: 0.78rem;
  color: #64748b;
}
</style>
