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
          <div class="input-shell">
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
        </div>

        <div class="field">
          <label>Fecha</label>
          <div class="input-shell">
            <input type="date" v-model="citaStore.nuevaCita.fecha_c">
          </div>
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

.form-section,
.resumen {
  background: #f6f4ec;
  border: 1px solid rgba(212, 163, 115, 0.16);
  border-radius: 24px;
  padding: 1rem;
}

.section-title {
  margin-bottom: 1rem;
}

.section-title h3 {
  margin: 0.35rem 0 0.35rem;
  color: #6b5440;
  font-size: 1.15rem;
  font-weight: 500;
}

.section-title p {
  margin: 0;
  color: #9a826f;
  line-height: 1.55;
  font-size: 0.92rem;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.38rem 0.75rem;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.14);
  color: #c27d42;
  font-size: 0.78rem;
  font-weight: 800;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
}

.field,
.servicios-grid {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

label {
  font-weight: 800;
  color: #5f4b3a;
  font-size: 0.92rem;
}

.selected-value {
  color: #d09a67;
  font-weight: 700;
}

input,
select {
  width: 100%;
  padding: 0.92rem 1rem;
  border: 1px solid rgba(212, 163, 115, 0.2);
  border-radius: 14px;
  background: #fbfaf6;
  color: #6a5644;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

input:focus,
select:focus {
  border-color: #d4a373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.1);
  background: #fff;
}

.info-box {
  padding: 0.95rem 1rem;
  border-radius: 16px;
  background: rgba(250, 237, 205, 0.6);
  color: #7b6652;
  border: 1px dashed rgba(212, 163, 115, 0.28);
  font-size: 0.92rem;
}

.info-box.empty {
  background: rgba(255, 243, 243, 0.72);
  color: #9d5b5b;
}

.botones-horas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.btn-hora {
  min-width: 78px;
  padding: 0.8rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(212, 163, 115, 0.18);
  background: #fbfaf7;
  color: #7b6652;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-hora:hover {
  background: #fff;
  border-color: rgba(212, 163, 115, 0.35);
}

.seleccionado-negro {
  background: #6b5440 !important;
  color: #fff !important;
  border-color: #6b5440 !important;
  box-shadow: 0 10px 22px rgba(95, 75, 58, 0.14);
}

.botones-servicios {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.btn-servicio {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  padding: 0.95rem 1rem;
  text-align: left;
  border-radius: 14px;
  border: 1px solid rgba(212, 163, 115, 0.16);
  background: #fbfaf7;
  color: #5f4b3a;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-servicio:hover {
  border-color: rgba(212, 163, 115, 0.35);
  background: #fff;
}

.btn-servicio.seleccionado {
  background: linear-gradient(135deg, #faedcd, #fefae0);
  border-color: #d4a373;
}

.servicio-nombre {
  font-weight: 800;
}

.servicio-precio {
  color: #c27d42;
  font-weight: 800;
  font-size: 0.9rem;
}

.resumen-header {
  margin-bottom: 0.9rem;
}

.resumen-header h3 {
  margin: 0 0 0.3rem;
  color: #5f4b3a;
  font-size: 1.1rem;
}

.resumen-header p {
  margin: 0;
  color: #8a725c;
  font-size: 0.92rem;
}

.resumen-card {
  padding: 1rem;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(250, 237, 205, 0.68), rgba(255, 255, 255, 0.92));
  border: 1px solid rgba(212, 163, 115, 0.18);
}

.resumen-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #5f4b3a;
  padding: 0.42rem 0;
}

.btn-agendar {
  width: 100%;
  margin-top: 0.9rem;
  border: none;
  border-radius: 16px;
  padding: 0.95rem 1.1rem;
  background: linear-gradient(135deg, #d4a373, #bf8c5a);
  color: white;
  font-weight: 900;
  font-size: 0.96rem;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  box-shadow: 0 12px 24px rgba(212, 163, 115, 0.2);
}

.btn-agendar:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px rgba(212, 163, 115, 0.28);
}

@media (max-width: 900px) {
  .field-grid,
  .botones-servicios {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .botones-horas {
    gap: 0.55rem;
  }

  .btn-hora {
    min-width: calc(50% - 0.3rem);
  }
}
</style>