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
  <div class="cita-container">
    <h2>Agendar Cita - Estética Nova</h2>

    <div class="field">
      <label>¿Quién te va a atender?</label>
      <select v-model="citaStore.nuevaCita.personal_id">
        <option :value="null" disabled>Selecciona un estilista</option>
        <option v-for="p in citaStore.personalData?.data || []" :key="p?.id" :value="p?.id">
          {{ p?.nombre }}
        </option>
      </select>
    </div>

    <div class="field">
      <label>Fecha:</label>
      <input type="date" v-model="citaStore.nuevaCita.fecha_c">
    </div>

    <div class="field">
      <label>Hora seleccionada: {{ citaStore.nuevaCita.hora_c || 'Ninguna' }}</label>
      
      <div v-if="citaStore.cargarHoras" class="info-texto">Buscando horarios disponibles...</div>
      
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

      <div v-else-if="citaStore.nuevaCita.fecha_c && citaStore.nuevaCita.personal_id" class="info-texto">
        No hay horarios disponibles para este día.
      </div>
    </div>

    <div class="servicios-grid">
      <label>Selecciona tus servicios (Máx. 3):</label>
      <div v-if="citaStore.cargandoServicios">Cargando servicios...</div>
      
      <div v-else class="botones-servicios">
        <button 
          v-for="s in citaStore.serviciosData?.data || []" 
          :key="s?.id"
          @click="citaStore.gestionarServicio(s)"
          type="button"
          :class="{ 'seleccionado': citaStore.nuevaCita.detalle_cita.some(item => item.tipo_servicio_id === s?.id) }"
        >
          {{ s?.nombre }} <span>(${{ s?.precio }})</span>
        </button>
      </div>
    </div>

    <div class="resumen" v-if="citaStore.nuevaCita.detalle_cita.length > 0">
      <p><strong>Total:</strong> ${{ citaStore.totalCita }}</p>
      <p><strong>Anticipo (20%):</strong> ${{ (citaStore.totalCita * 0.2).toFixed(2) }}</p>
      <button @click="submitiarlacita" class="btn-agendar">Confirmar Cita</button>
    </div>
  </div>

  <pre>ID Personal: {{ citaStore.nuevaCita.personal_id }}</pre>
  <pre>Hora: {{ citaStore.nuevaCita.hora_c }}</pre>
  <pre>Servicios: {{ citaStore.nuevaCita.detalle_cita }}</pre>
</template>
<style scoped>
/* Contenedor principal con un toque más elegante */
.cita-container { 
  max-width: 500px; 
  margin: 40px auto; 
  padding: 30px; 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #fff;
  border: 1px solid #000; /* Borde negro fino */
  border-radius: 8px;
  color: #000; /* Todo el texto base en negro */
}

h2 {
  text-align: center;
  color: #000;
  margin-bottom: 25px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.field { 
  margin-bottom: 20px; 
  display: flex; 
  flex-direction: column; 
}

/* Labels en negrita negra */
label {
  font-weight: bold;
  color: #000;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

/* Inputs y Selects con texto negro */
input, select {
  padding: 10px;
  border: 1px solid #000;
  border-radius: 4px;
  color: #000;
  background-color: #fff;
  font-size: 1rem;
}

.servicios-grid {
  margin-top: 20px;
}

.botones-servicios { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 12px; 
  margin-top: 10px;
}

/* Botones de servicios */
button {
  padding: 12px;
  border: 1px solid #000;
  background: #fff;
  color: #000; /* Letra negra */
  cursor: pointer;
  border-radius: 5px;
  font-weight: 500;
  transition: all 0.2s ease;
}

button:hover {
  background-color: #f0f0f0;
}

/* El verde del seleccionado lo dejamos para que resalte, pero con letra negra o blanca */
button.seleccionado {
  background-color: #4ade80; 
  border-color: #000;
  color: #000; /* Letra negra sobre el verde para que combine */
  font-weight: bold;
}

/* Sección de resumen */
.resumen {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #000;
}

.resumen p {
  margin: 5px 0;
  color: #000;
  display: flex;
  justify-content: space-between;
}

/* Botón de acción principal */
.btn-agendar {
  width: 100%;
  background-color: #000; /* Botón negro para que se vea elegante */
  color: #fff; /* Letra blanca para que resalte en el fondo negro */
  font-weight: bold;
  margin-top: 20px;
  padding: 15px;
  border: none;
  text-transform: uppercase;
  font-size: 1rem;
}

.btn-agendar:hover {
  background-color: #333;
}

/* Estilo para los pre de debug (negro sobre gris clarito) */
pre {
  background: #f4f4f4;
  padding: 10px;
  color: #000;
  font-size: 0.8rem;
  border: 1px dashed #000;
  margin-top: 10px;
}
</style>