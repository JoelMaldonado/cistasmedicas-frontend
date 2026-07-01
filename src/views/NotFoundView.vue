<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const authStore = useAuthStore()

function goHome() {
  router.push(authStore.isAuthenticated ? `/dashboard/${authStore.role}` : '/login')
}
</script>

<template>
  <div class="not-found">
    <EmptyState icon="pi pi-compass" title="Página no encontrada" message="La página que buscas no existe o fue movida.">
      <Button label="Volver al inicio" icon="pi pi-home" @click="goHome" />
    </EmptyState>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
