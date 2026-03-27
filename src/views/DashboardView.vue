<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <div style="padding: 20px; text-align: center;">
    <h2> Bienvenido de nuevo</h2>
   
    <p>Ya estás dentro del sistema de la estética.</p>
  </div>
</template>