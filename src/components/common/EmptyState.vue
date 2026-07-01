<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    title: string
    message?: string
  }>(),
  {
    icon: 'pi pi-inbox',
  },
)
</script>

<template>
  <div class="empty-state">
    <i :class="icon" class="empty-state__icon" />
    <h3>{{ title }}</h3>
    <p v-if="message">{{ message }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem;
  color: #64748b;
}

.empty-state__icon {
  font-size: 2.5rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.35rem;
  color: #334155;
  font-size: 1.05rem;
}

.empty-state p {
  margin: 0;
  max-width: 320px;
}
</style>
