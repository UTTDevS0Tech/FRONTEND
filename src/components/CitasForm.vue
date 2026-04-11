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
  <div class="cita-form">
    <div class="form-section">
      <div class="section-title">
        <span class="section-badge">Paso 1</span>
        <h3>Datos de la cita</h3>
        <p>Selecciona quién te atenderá, la fecha y un horario disponible.</p>
      </div>

      <div class="field-grid">
        <div class="field">
          <label>¿Quién te va a atender?</label>
          <select v-model="citaStore.nuevaCita.personal_id">
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
          <input type="date" v-model="citaStore.nuevaCita.fecha_c">
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="section-title">
        <span class="section-badge">Paso 2</span>
        <h3>Horario disponible</h3>
        <p>Elige la hora que mejor se acomode a tu cita.</p>
      </div>

      <div class="field">
        <label>
          Hora seleccionada:
          <span class="selected-value">
            {{ citaStore.nuevaCita.hora_c || 'Ninguna' }}
          </span>
        </label>

        <div v-if="citaStore.cargarHoras" class="info-box">
          Buscando horarios disponibles...
        </div>

        <div v-else-if="citaStore.horasDisponibles.length > 0" class="botones-horas">
          <button
            v-for="h in citaStore.horasDisponibles"
            :key="h.hora"
            type="button"
            class="btn-hora"
            :class="{ 'seleccionado-negro': citaStore.nuevaCita.hora_c === h.hora }"
            @click="citaStore.nuevaCita.hora_c = h.hora"
          >
            {{ h.formato_12h }}
          </button>
        </div>

        <div
          v-else-if="citaStore.nuevaCita.fecha_c && citaStore.nuevaCita.personal_id"
          class="info-box empty"
        >
          No hay horarios disponibles para este día.
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="section-title">
        <span class="section-badge">Paso 3</span>
        <h3>Servicios</h3>
        <p>Selecciona hasta 3 servicios para tu cita.</p>
      </div>

      <div class="servicios-grid">
        <label>Selecciona tus servicios (Máx. 3)</label>

        <div v-if="citaStore.cargandoServicios" class="info-box">
          Cargando servicios...
        </div>

        <div v-else class="botones-servicios">
          <button
            v-for="s in citaStore.serviciosData?.data || []"
            :key="s?.id"
            @click="citaStore.gestionarServicio(s)"
            type="button"
            class="btn-servicio"
            :class="{ 'seleccionado': citaStore.nuevaCita.detalle_cita.some(item => item.tipo_servicio_id === s?.id) }"
          >
            <span class="servicio-nombre">{{ s?.nombre }}</span>
            <span class="servicio-precio">${{ s?.precio }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="resumen" v-if="citaStore.nuevaCita.detalle_cita.length > 0">
      <div class="resumen-header">
        <h3>Resumen de tu cita</h3>
        <p>Revisa el total antes de confirmar.</p>
      </div>

      <div class="resumen-card">
        <div class="resumen-row">
          <span>Total</span>
          <strong>${{ citaStore.totalCita }}</strong>
        </div>

        <div class="resumen-row">
          <span>Anticipo (20%)</span>
          <strong>${{ (citaStore.totalCita * 0.2).toFixed(2) }}</strong>
        </div>

        <button @click="submitiarlacita" class="btn-agendar">
          Confirmar cita
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cita-form {
  display: grid;
  gap: 1.25rem;
}
</style>