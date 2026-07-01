<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string
    label: string
    value: string | number
    color?: string
  }>(),
  {
    color: '#0284c7',
  },
)
</script>

<template>
  <Card class="stat-card">
    <template #content>
      <div class="stat-card__body">
        <div class="stat-card__icon" :style="{ background: `${color}1a`, color }">
          <i :class="icon" />
        </div>
        <div>
          <p class="stat-card__value">{{ value }}</p>
          <p class="stat-card__label">{{ label }}</p>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.stat-card :deep(.p-card-body) {
  padding: 1rem 1.25rem;
}

.stat-card__body {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.stat-card__value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-card__label {
  margin: 0.15rem 0 0;
  font-size: 0.85rem;
  color: #64748b;
}
</style>
