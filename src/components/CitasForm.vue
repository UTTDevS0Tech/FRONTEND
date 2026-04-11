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

    <!-- Debug -->
    <div class="debug-box">
      <pre>ID Personal: {{ citaStore.nuevaCita.personal_id }}</pre>
      <pre>Hora: {{ citaStore.nuevaCita.hora_c }}</pre>
      <pre>Servicios: {{ citaStore.nuevaCita.detalle_cita }}</pre>
    </div>
  </div>
</template>

<style scoped>
.cita-form {
  display: grid;
  gap: 1.5rem;
}

.form-section,
.resumen {
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(212, 163, 115, 0.22);
  border-radius: 28px;
  padding: 1.5rem;
  box-shadow: 0 18px 40px rgba(95, 75, 58, 0.08);
  backdrop-filter: blur(10px);
}

.section-title {
  margin-bottom: 1.2rem;
}

.section-title h3 {
  margin: 0.35rem 0 0.35rem;
  color: #5f4b3a;
  font-size: 1.35rem;
}

.section-title p {
  margin: 0;
  color: #8a725c;
  line-height: 1.6;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.42rem 0.8rem;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.16);
  color: #b9793f;
  font-size: 0.82rem;
  font-weight: 800;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field,
.servicios-grid {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

label {
  font-weight: 800;
  color: #5f4b3a;
  font-size: 0.95rem;
}

.selected-value {
  color: #b9793f;
}

.input-shell {
  position: relative;
}

input,
select {
  width: 100%;
  padding: 0.95rem 1rem;
  border: 1px solid rgba(212, 163, 115, 0.28);
  border-radius: 16px;
  background: #fffdf8;
  color: #5f4b3a;
  font-size: 0.98rem;
  outline: none;
  transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
  box-sizing: border-box;
}

input:focus,
select:focus {
  border-color: #d4a373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.12);
  transform: translateY(-1px);
}

.info-box {
  padding: 1rem 1.1rem;
  border-radius: 18px;
  background: rgba(250, 237, 205, 0.65);
  color: #7b6652;
  border: 1px dashed rgba(212, 163, 115, 0.35);
  font-size: 0.95rem;
}

.info-box.empty {
  background: rgba(255, 243, 243, 0.72);
  color: #9d5b5b;
}

.botones-horas {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(115px, 1fr));
  gap: 0.8rem;
}

.btn-hora {
  padding: 0.85rem 0.9rem;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: #fff;
  color: #5f4b3a;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

.btn-hora:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(95, 75, 58, 0.08);
  background: #fef7ed;
}

.seleccionado-negro {
  background: #5f4b3a !important;
  color: #fff !important;
  border-color: #5f4b3a !important;
  box-shadow: 0 12px 24px rgba(95, 75, 58, 0.18);
}

.botones-servicios {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.btn-servicio {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  padding: 1rem;
  text-align: left;
  border-radius: 18px;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: #fff;
  color: #5f4b3a;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.btn-servicio:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 22px rgba(95, 75, 58, 0.08);
  border-color: rgba(212, 163, 115, 0.4);
}

.btn-servicio.seleccionado {
  background: linear-gradient(135deg, #faedcd, #fefae0);
  border-color: #d4a373;
  box-shadow: 0 14px 28px rgba(212, 163, 115, 0.18);
}

.servicio-nombre {
  font-weight: 800;
}

.servicio-precio {
  color: #b9793f;
  font-weight: 700;
  font-size: 0.92rem;
}

.resumen-header {
  margin-bottom: 1rem;
}

.resumen-header h3 {
  margin: 0 0 0.35rem;
  color: #5f4b3a;
}

.resumen-header p {
  margin: 0;
  color: #8a725c;
}

.resumen-card {
  padding: 1.2rem;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(250, 237, 205, 0.72), rgba(255, 255, 255, 0.9));
  border: 1px solid rgba(212, 163, 115, 0.22);
}

.resumen-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #5f4b3a;
  padding: 0.45rem 0;
}

.btn-agendar {
  width: 100%;
  margin-top: 1rem;
  border: none;
  border-radius: 18px;
  padding: 1rem 1.2rem;
  background: linear-gradient(135deg, #d4a373, #c38b5d);
  color: white;
  font-weight: 900;
  font-size: 0.98rem;
  cursor: pointer;
  box-shadow: 0 16px 30px rgba(212, 163, 115, 0.22);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.btn-agendar:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 34px rgba(212, 163, 115, 0.3);
}

.debug-box {
  display: grid;
  gap: 0.7rem;
}

pre {
  margin: 0;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  background: rgba(95, 75, 58, 0.06);
  border: 1px dashed rgba(95, 75, 58, 0.2);
  color: #5f4b3a;
  font-size: 0.82rem;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 820px) {
  .field-grid,
  .botones-servicios {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .form-section,
  .resumen {
    padding: 1.1rem;
    border-radius: 22px;
  }

  .botones-horas {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .btn-hora,
  .btn-servicio,
  .btn-agendar {
    font-size: 0.94rem;
  }
}
</style>