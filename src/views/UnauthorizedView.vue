<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const authStore = useAuthStore()
</script>

<template>
  <div class="page">
    <EmptyState icon="pi pi-lock" title="No tienes acceso a esta página" message="Tu rol actual no permite ver este contenido.">
      <Button label="Volver a mi dashboard" icon="pi pi-home" @click="router.push(`/dashboard/${authStore.role}`)" />
    </EmptyState>
  </div>
</template>
