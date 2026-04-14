<script setup lang="ts">
import { onMounted } from 'vue'
import { usePersonalCitasStore } from '@/stores/estilistaCita'

const store = usePersonalCitasStore()

onMounted(() => {
    store.obtenerCitasDePersonal()
})
</script>

<template>
  <div class="agenda-view">
    <div class="detalles-header">
      <h3>Mi Agenda de Trabajo</h3>
      <span>{{ store.citas.length }} citas programadas</span>
    </div>

    <div v-if="!store.citas.length && !store.mensajeError" class="info-box mt-4">
      Consultando tu agenda, espérame tantito...
    </div>

    <div v-if="store.mensajeError" class="info-box mt-4" style="color: #c0392b;">
      {{ store.mensajeError }}
    </div>

    <div v-if="store.citas.length > 0" class="servicios-grid mt-4">
      <div 
        v-for="cita in store.citas" 
        :key="cita.cita_id" 
        class="servicio-card" 
        :class="{ 'status-pending': cita.estado === 'pendiente' }"
      >
        <div class="flex-row">
            <span class="servicio-nombre">{{ cita.nombre_cliente }}</span>
            <span class="badge">{{ cita.estado }}</span>
        </div>
        
        <div class="cita-info">
            <strong>🕒 {{ cita.hora_c }} - {{ cita.hora_fin }}</strong>
            <p>📅 {{ cita.fecha_c }}</p>
        </div>

        <div class="total-row mt-2">
            <span>Cobro:</span>
            <strong class="servicio-precio">${{ cita.total }}</strong>
        </div>
      </div>
    </div>

    <div v-else-if="!store.mensajeError" class="info-box mt-4">
      No tienes citas para mostrar. ¡Día libre!
    </div>
  </div>
</template>

<style scoped>
/* Reutilizamos tus clases para que se vea igual */
.agenda-view {
    display: grid;
    gap: 1.5rem;
    padding: 1rem;
}

.flex-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.cita-info {
    font-size: 0.9rem;
    color: #8a7764;
    margin: 8px 0;
}

.badge {
    font-size: 0.7rem;
    padding: 4px 8px;
    background: #ccd5ae;
    border-radius: 8px;
    color: #5f4b3a;
    text-transform: uppercase;
    font-weight: 800;
}

.status-pending {
    border-left: 5px solid #D4A373; /* Color café de tu formulario */
}

.mt-4 { margin-top: 1rem; }
.mt-2 { margin-top: 0.5rem; }

/* Aquí puedes pegar los mismos estilos de .servicio-card, .detalles-header, etc. que ya tienes */
</style>