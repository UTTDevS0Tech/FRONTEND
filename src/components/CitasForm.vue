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
    <h2>Agendar Cita - Estética Yamileth</h2>

    <div class="field">
      <label>¿Quién te va a atender?</label>
      <select v-model="citaStore.nuevaCita.personal_id">
        <option :value="null" disabled>Selecciona un estilista</option>
        
        <option v-for="p in citaStore.personalData || []" :key="p?.id" :value="p?.id">
          {{ p?.nombre }}
        </option>
      </select>
    </div>

    <div class="field">
      <label>Fecha:</label>
      <input type="date" v-model="citaStore.nuevaCita.fecha_c">
    </div>

    <div class="field">
      <label>Hora:</label>
      <input type="time" v-model="citaStore.nuevaCita.hora_c">
    </div>

    <div class="servicios-grid">
      <label>Selecciona tus servicios:</label>
      <div v-if="citaStore.cargandoServicios">Cargando servicios...</div>
      
      <div v-else class="botones-servicios">
        <button 
          v-for="s in citaStore.serviciosData || []" 
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
</template>
<style scoped>
/* Estilos rápidos sin librerías externas */
.cita-container { max-width: 500px; margin: auto; padding: 20px; font-family: sans-serif; }
.field { margin-bottom: 15px; display: flex; flex-direction: column; }
.botones-servicios { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

button {
  padding: 10px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 5px;
}

button.seleccionado {
  background-color: #4ade80; /* Verde si está seleccionado */
  border-color: #22c55e;
  color: white;
}

.btn-agendar {
  width: 100%;
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  margin-top: 20px;
  padding: 15px;
}
</style>