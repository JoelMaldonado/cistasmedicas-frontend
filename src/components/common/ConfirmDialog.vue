<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    severity?: 'danger' | 'warn' | 'info' | 'success'
    loading?: boolean
  }>(),
  {
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    severity: 'info',
    loading: false,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const visible = defineModel<boolean>('visible', { required: true })

function handleCancel() {
  visible.value = false
  emit('cancel')
}

function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :closable="!loading" :style="{ width: '420px' }" :header="title">
    <p class="confirm-dialog__message">{{ message }}</p>
    <template #footer>
      <Button :label="cancelLabel" text severity="secondary" :disabled="loading" @click="handleCancel" />
      <Button :label="confirmLabel" :severity="severity" :loading="loading" @click="handleConfirm" />
    </template>
  </Dialog>
</template>

<style scoped>
.confirm-dialog__message {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}
</style>
