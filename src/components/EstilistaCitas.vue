<script setup lang="ts">
import { onMounted } from 'vue'
import { usePersonalCitasStore } from '@/stores/estilistaCita'

const store = usePersonalCitasStore()

onMounted(() => {
  store.obtenerCitasDePersonal()
})

function claseEstado(estado: string) {
  return `estado-${estado}`
}
</script>

<template>
  <div class="agenda-panel">
    <div class="detalles-header">
      <div>
        <h3>Mi Agenda de Trabajo</h3>
        <p>Revisa aquí las citas asignadas para tu jornada.</p>
      </div>
      <span>{{ store.citas.length }} citas programadas</span>
    </div>

    <div v-if="!store.citas.length && !store.mensajeError" class="info-box mt-4">
      Consultando tu agenda, espérame tantito...
    </div>

    <div v-if="store.mensajeError" class="info-box error-box mt-4">
      {{ store.mensajeError }}
    </div>

    <div v-if="store.citas.length > 0" class="servicios-grid mt-4">
      <div
        v-for="cita in store.citas"
        :key="cita.cita_id"
        class="servicio-card"
        :class="[claseEstado(cita.estado)]"
      >
        <div class="flex-row">
          <span class="servicio-nombre">{{ cita.nombre_cliente }}</span>
          <span class="badge" :class="claseEstado(cita.estado)">
            {{ cita.estado }}
          </span>
        </div>

        <div class="cita-info">
          <strong> {{ cita.hora_c }} - {{ cita.hora_fin }}</strong>
          <p> {{ cita.fecha_c }}</p>
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
.agenda-panel {
  display: grid;
  gap: 1rem;
}

.detalles-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.detalles-header h3 {
  margin: 0 0 0.35rem;
  color: #5f4b3a;
  font-size: 1.3rem;
}

.detalles-header p {
  margin: 0;
  color: #8a7764;
  font-size: 0.95rem;
}

.detalles-header span {
  color: #8a7764;
  font-weight: 800;
  font-size: 0.95rem;
}

.flex-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.cita-info {
  font-size: 0.92rem;
  color: #8a7764;
  margin: 8px 0;
  display: grid;
  gap: 6px;
}

.cita-info p,
.cita-info strong {
  margin: 0;
}

.badge {
  font-size: 0.72rem;
  padding: 6px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  font-weight: 800;
  white-space: nowrap;
}

.badge.estado-pendiente {
  background: rgba(250, 237, 205, 0.95);
  color: #9b6a3b;
}

.badge.estado-confirmada {
  background: rgba(204, 213, 174, 0.45);
  color: #536437;
}

.badge.estado-cancelada {
  background: rgba(255, 226, 226, 0.95);
  color: #ae4d4d;
}

.badge.estado-completada {
  background: rgba(220, 232, 250, 0.92);
  color: #355886;
}

.servicios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.servicio-card {
  border-radius: 22px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(212, 163, 115, 0.18);
  box-shadow: 0 12px 24px rgba(92, 75, 59, 0.08);
  display: grid;
  gap: 10px;
}

.servicio-card.estado-pendiente {
  border-left: 5px solid #D4A373;
}

.servicio-card.estado-confirmada {
  border-left: 5px solid #ccd5ae;
}

.servicio-card.estado-cancelada {
  border-left: 5px solid #e8b4b4;
}

.servicio-card.estado-completada {
  border-left: 5px solid #b7c9e8;
}

.servicio-nombre {
  color: #5f4b3a;
  font-weight: 800;
  font-size: 1rem;
}

.servicio-precio {
  color: #8d633c;
  font-size: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  color: #5f4b3a;
}

.info-box {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(250, 237, 205, 0.45);
  color: #7c6856;
  border: 1px dashed rgba(212, 163, 115, 0.24);
  font-weight: 600;
}

.error-box {
  background: rgba(255, 228, 228, 0.9);
  color: #a14444;
  border: 1px solid rgba(161, 68, 68, 0.14);
}

.mt-4 {
  margin-top: 1rem;
}

.mt-2 {
  margin-top: 0.5rem;
}
</style>