<script setup lang="ts"></script>

<template>
  <div class="auth-layout">
    <router-view />
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #e0f2fe 0%, #f4f8fb 55%, #ecfdf5 100%);
  padding: 1.5rem;
}
</style>
