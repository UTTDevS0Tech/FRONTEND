<script setup lang="ts">
import { useCitaStore } from '@/stores/cita'
import { useRouter } from 'vue-router'




const citaStore = useCitaStore()
const router = useRouter()



const submitiarlacita = async () => {
    if(citaStore.nuevaCita.detalle_cita.length === 0) {
        alert("seleccione al menos un servicio")
        return
    }

    if(!citaStore.nuevaCita.personal_id || !citaStore.nuevaCita.fecha_c || !citaStore.nuevaCita.hora_c) {
        alert("compare llename todos los campos")
        return
    }

    const sisaliotodobien = await citaStore.enviarCita()
    if(sisaliotodobien) {
        alert("todo salio bien")//despues usare el router.pus(mis citas)
        router.push('/dashboard/cliente')
      }


}

</script>

<template>
  <form class="cita-form" @submit.prevent="submitiarlacita">
    <div class="grid">
      <div class="field">
        <label>Personal</label>
        <select v-model="citaStore.nuevaCita.personal_id" required>
          <option :value="null" disabled>Selecciona un estilista</option>
          <option
            v-for="p in citaStore.personalData?.data || []"
            :key="p?.id"
            :value="p?.id"
          >
            {{ p?.nombre }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>Fecha</label>
        <input
          v-model="citaStore.nuevaCita.fecha_c"
          type="date"
          required
        />
      </div>
    </div>

    <div class="detalles">
      <div class="detalles-header">
        <h3>Horario disponible</h3>
      </div>

      <p class="helper-text">
        Hora seleccionada:
        <strong>{{ citaStore.nuevaCita.hora_c || 'Ninguna' }}</strong>
      </p>

      <div v-if="citaStore.cargarHoras" class="info-box">
        Buscando horarios disponibles...
      </div>

      <div v-else-if="citaStore.horasDisponibles.length > 0" class="horas-grid">
        <button
          v-for="h in citaStore.horasDisponibles"
          :key="h.hora"
          type="button"
          class="btn hora-btn"
          :class="{ selected: citaStore.nuevaCita.hora_c === h.hora }"
          @click="citaStore.nuevaCita.hora_c = h.hora"
        >
          {{ h.formato_12h }}
        </button>
      </div>

      <div
        v-else-if="citaStore.nuevaCita.fecha_c && citaStore.nuevaCita.personal_id"
        class="info-box"
      >
        No hay horarios disponibles para este día.
      </div>
    </div>

    <div class="detalles">
      <div class="detalles-header">
        <h3>Servicios</h3>
        <span>Máximo 3 servicios</span>
      </div>

      <div v-if="citaStore.cargandoServicios" class="info-box">
        Cargando servicios...
      </div>

      <div v-else class="servicios-grid">
        <button
          v-for="s in citaStore.serviciosData?.data || []"
          :key="s?.id"
          type="button"
          class="servicio-card"
          :class="{ selected: citaStore.nuevaCita.detalle_cita.some(item => item.tipo_servicio_id === s?.id) }"
          @click="citaStore.gestionarServicio(s)"
        >
          <span class="servicio-nombre">{{ s?.nombre }}</span>
          <strong class="servicio-precio">${{ s?.precio }}</strong>
        </button>
      </div>
    </div>

    <div class="total-box" v-if="citaStore.nuevaCita.detalle_cita.length > 0">
      <div class="total-row">
        <span>Total:</span>
        <strong>${{ citaStore.totalCita }}</strong>
      </div>
      <div class="total-row anticipo">
        <span>Anticipo (20%):</span>
        <strong>${{ (citaStore.totalCita * 0.2).toFixed(2) }}</strong>
      </div>
    </div>

    <button
      v-if="citaStore.nuevaCita.detalle_cita.length > 0"
      type="submit"
      class="submit-btn"
    >
      Confirmar cita
    </button>
  </form>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.cita-form {
  display: grid;
  gap: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.field {
  display: grid;
  gap: 0.45rem;
}

.field label,
.detalles-header h3 {
  color: #5f4b3a;
  font-weight: 800;
}

.detalles {
  display: grid;
  gap: 1rem;
}

.detalles-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.detalles-header h3 {
  margin: 0;
  font-size: 1.05rem;
}

.detalles-header span,
.helper-text {
  color: #8a7764;
  font-size: 0.95rem;
}

.helper-text {
  margin: 0;
}

.helper-text strong {
  color: #5f4b3a;
}

.horas-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.servicios-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.total-box {
  padding: 0.95rem 1rem;
  border-radius: 16px;
  background: rgba(204, 213, 174, 0.25);
  color: #5f4b3a;
  font-size: 1.05rem;
  display: grid;
  gap: 0.45rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.anticipo {
  color: #6d5844;
}

input,
select {
  width: 100%;
  min-width: 0;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.25);
  background: rgba(255, 255, 255, 0.95);
  color: #5f4b3a;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s ease;
  font-family: inherit;
}

input:hover,
select:hover {
  border-color: rgba(212, 163, 115, 0.5);
}

input:focus,
select:focus {
  border-color: #D4A373;
  box-shadow:
    0 0 0 4px rgba(212, 163, 115, 0.15),
    0 6px 12px rgba(212, 163, 115, 0.15);
  transform: translateY(-1px);
}

.info-box {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(250, 237, 205, 0.45);
  color: #7c6856;
  border: 1px dashed rgba(212, 163, 115, 0.24);
  font-weight: 600;
}

.btn {
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.95rem;
  transition: all 0.22s ease;
  white-space: nowrap;
}

.hora-btn {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.92);
  color: #5f4b3a;
  border: 1px solid rgba(212, 163, 115, 0.22);
}

.hora-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.08);
}

.hora-btn.selected {
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.25);
}

.servicio-card {
  display: grid;
  gap: 6px;
  text-align: left;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: rgba(255, 255, 255, 0.95);
  color: #5f4b3a;
  cursor: pointer;
  transition: all 0.22s ease;
}

.servicio-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.08);
  border-color: rgba(212, 163, 115, 0.4);
}

.servicio-card.selected {
  background: rgba(204, 213, 174, 0.25);
  border-color: #ccd5ae;
}

.servicio-nombre {
  font-weight: 800;
}

.servicio-precio {
  color: #8d633c;
}

.submit-btn {
  width: 100%;
  padding: 0.95rem 1rem;
  border: none;
  border-radius: 16px;
  background: #D4A373 !important;
  color: white !important;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.25) !important;
  transition: all 0.22s ease;
}

.submit-btn:hover {
  background: #c89463 !important;
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(212, 163, 115, 0.32);
}

@media (max-width: 900px) {
  .grid,
  .servicios-grid {
    grid-template-columns: 1fr;
  }

  .detalles-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .submit-btn {
    width: 100%;
  }
}
</style>