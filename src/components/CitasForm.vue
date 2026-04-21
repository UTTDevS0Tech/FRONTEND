<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCitaStore } from '@/stores/cita'
import { useRouter } from 'vue-router'
import { loadStripe } from '@stripe/stripe-js'
import { onMounted } from 'vue'

const citaStore = useCitaStore()
const router = useRouter()

const errorCita = ref('')
const modalExitoAbierto = ref(false)
const modalTerminosAbierto = ref(false)
const stripe = ref<any>(null)
const cardElement = ref<any>(null)
const cargandoProceso = ref(false)

const ivaCita = computed(() => citaStore.totalCita * 0.16)
const totalConIva = computed(() => citaStore.totalCita + ivaCita.value)



onMounted(async () => {
  stripe.value = await loadStripe('pk_test_51TMc6UHlgZ3HN3OhXVyLgIFy58QNBiE2zEIIvke23OMpGKzZ9UXJPxYGncfUtNLGTZDUpLtw8WoYIHWxoFSBxuLi00tKRv6hFL')
  const elements = stripe.value.elements()
  
  cardElement.value = elements.create('card', {
    style: {
      base: {
        fontSize: '16px',
        color: '#5f4b3a',
        fontFamily: 'inherit',
        '::placeholder': { color: '#aab7c4' },
      }
    }
  })
  cardElement.value.mount('#card-element')
})

const procesarPagoYConfirmar = async () => {
  errorCita.value = ''
  cargandoProceso.value = true

if(citaStore.nuevaCita.detalle_cita.length === 0) {
  errorCita.value = 'Selecciona al menos un servicio para continuar.'
  cargandoProceso.value = false
  return


}

if(!citaStore.nuevaCita.personal_id || !citaStore.nuevaCita.fecha_c || !citaStore.nuevaCita.hora_c) {
  errorCita.value = 'Selecciona personal, fecha y hora para continuar.'
  cargandoProceso.value = false
  return
}

const datosPago = await citaStore.obtenerStripeSecret()


if(!datosPago) {
  errorCita.value = 'Error al iniciar el proceso de pago Intenta nuevamente.'
  cargandoProceso.value = false
  return
}


const {paymentIntent, error} = await stripe.value.confirmCardPayment(datosPago.clientSecret, {
  payment_method: {
card: cardElement.value,
  }
  })

  if(error) {
    errorCita.value = error.message || 'Error al procesar el pago. Intenta nuevamente.'
    cargandoProceso.value = false
    return
  }
  if(paymentIntent.status === 'succeeded'){
    const sisaliotodobien = await citaStore.enviarCita()

    if(sisaliotodobien) {
      modalExitoAbierto.value = true
    } else {
      errorCita.value = 'error al confirmar la cita'
    }
  }

  cargandoProceso.value = false



}




function irAMisCitas() {
  modalExitoAbierto.value = false
  modalTerminosAbierto.value = false
  router.push('/dashboard/cliente')
}

function abrirTerminos() {
  modalExitoAbierto.value = false
  modalTerminosAbierto.value = true
}

function cerrarTerminos() {
  modalTerminosAbierto.value = false
  router.push('/dashboard/cliente')
}
</script>

<template>
  <div class="cita-form-wrap">
    <form class="cita-form" @submit.prevent="procesarPagoYConfirmar">
      
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

   <div class="total-box" v-show="citaStore.nuevaCita.detalle_cita.length > 0">
  <div class="total-row">
    <span>Subtotal:</span>
    <strong>${{ citaStore.totalCita.toFixed(2) }}</strong>
  </div>
  <div class="total-row">
    <span>IVA (16%):</span>
    <strong>${{ ivaCita.toFixed(2) }}</strong>
  </div>
  <div class="total-row">
    <span>Total:</span>
    <strong>${{ totalConIva.toFixed(2) }}</strong>
  </div>
  <div class="stripe-container-wrap">
    <label class="pago-label">Datos de tarjeta bancaria</label>
    <div id="card-element" class="stripe-input"></div>
  </div>
</div>

      <div v-if="errorCita" class="mensaje-error">
        {{ errorCita }}
      </div>
      <div v-else-if="citaStore.mensaje && citaStore.tipoMensaje === 'error'" class="mensaje-error">
        {{ citaStore.mensaje }}
      </div>

      <button
        v-if="citaStore.nuevaCita.detalle_cita.length > 0"
        type="submit"
        class="submit-btn"
        :disabled="cargandoProceso"
      >
        <span v-if="!cargandoProceso">Pagar Apartado y Confirmar Cita</span>
        <span v-else>Procesando pago...</span>
      </button>
    </form>

    <transition name="fade">
      <div v-if="modalExitoAbierto" class="modal-overlay" @click.self="irAMisCitas">
        <div class="modal-card modal-card-small">
          <div class="modal-header centered">
            <div>
              <h3>¡Cita agendada con éxito!</h3>
              <p>Tu pago ha sido procesado correctamente.</p>
            </div>
          </div>
          <div class="modal-actions vertical">
            <button type="button" class="btn primary full-btn" @click="irAMisCitas">
              Ver mis citas pendientes
            </button>
            <button type="button" class="btn secondary full-btn" @click="abrirTerminos">
              Ver términos y condiciones
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="modalTerminosAbierto" class="modal-overlay" @click.self="cerrarTerminos">
        <div class="modal-card">
          <div class="modal-header">
            <div>
              <h3>Términos y condiciones</h3>
              <p>Lee esta información antes de continuar.</p>
            </div>
            <button type="button" class="close-btn" @click="cerrarTerminos">✕</button>
          </div>
          <div class="terminos-box">
            <p><strong>1. Política de pago</strong></p>
            <p>Al realizar tu pago en línea, estás abonando el 20% del total para apartar tu cita.</p>
            <p><strong>2. Cancelación</strong></p>
            <p>Tienes hasta 12 horas antes para cancelar. De lo contrario, el adelanto no es reembolsable.</p>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn primary full-btn" @click="cerrarTerminos">Cerrar</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<style scoped>
/* Agrega estos para que el cuadro de Stripe se vea bien integrado */
.stripe-container-wrap {
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.3);
}

.pago-label {
  display: block;
  color: #5f4b3a;
  font-weight: 800;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.stripe-input {
  padding: 10px 0;
}

/* El resto de tus estilos se mantienen igual... */



:global(*) {
  box-sizing: border-box;
}

.cita-form-wrap {
  display: grid;
}

.cita-form {
  display: grid;
  gap: 1rem;
}

.mensaje-error {
  padding: 14px 18px;
  border-radius: 16px;
  font-weight: 700;
  background: rgba(255, 228, 228, 0.9);
  color: #a14444;
  border: 1px solid rgba(161, 68, 68, 0.14);
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(71, 58, 45, 0.35);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 200;
}

.modal-card {
  width: min(760px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 28px;
  background: rgba(254, 250, 224, 0.98);
  box-shadow: 0 28px 60px rgba(92, 75, 59, 0.22);
  padding: 24px;
}

.modal-card-small {
  width: min(520px, 100%);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
}

.modal-header.centered {
  justify-content: center;
  text-align: center;
}

.modal-header h3 {
  margin: 0 0 6px;
  font-size: 1.5rem;
  color: #5f4b3a;
}

.modal-header p {
  margin: 0;
  color: #8a7764;
  font-size: 0.95rem;
}

.close-btn {
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 900;
  background: rgba(255, 226, 226, 0.95);
  color: #a14444;
}

.close-btn:hover {
  transform: translateY(-2px);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.modal-actions.vertical {
  flex-direction: column;
}

.full-btn {
  width: 100%;
  justify-content: center;
}

.btn.primary {
  padding: 12px 18px;
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.25);
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(212, 163, 115, 0.32);
}

.btn.secondary {
  padding: 12px 18px;
  background: linear-gradient(135deg, #ccd5ae, #b8c493);
  color: #5f4b3a;
  box-shadow: 0 14px 24px rgba(179, 192, 136, 0.22);
}

.btn.secondary:hover {
  transform: translateY(-2px);
}

.terminos-box {
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(212, 163, 115, 0.16);
  color: #5f4b3a;
  line-height: 1.75;
  display: grid;
  gap: 10px;
  margin-bottom: 18px;
}

.terminos-box p {
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

@media (max-width: 700px) {
  .modal-card,
  .modal-card-small {
    padding: 18px;
    border-radius: 22px;
  }
}
</style>
