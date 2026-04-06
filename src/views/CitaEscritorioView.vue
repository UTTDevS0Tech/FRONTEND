<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CitaEscritorioForm from '@/components/citaEscritorioForm.vue'
import { useCitaEscritorioStore } from '@/stores/citaEscritorio'
import type {
  ClienteOption,
  PersonalOption,
  ServicioOption,
  FormularioCitaEscritorio,
  CitaEscritorioPayload,
} from '@/types/citaEscritorio'

const citaStore = useCitaEscritorioStore()

const clientes = ref<ClienteOption[]>([
  { id: 1, nombre: 'Juan Pérez' },
  { id: 2, nombre: 'María López' },
])

const personales = ref<PersonalOption[]>([
  { id: 1, nombre: 'Ana' },
  { id: 2, nombre: 'Luis' },
])

const servicios = ref<ServicioOption[]>([
  { id: 1, nombre: 'Corte', precio: 120 },
  { id: 2, nombre: 'Tinte', precio: 350 },
  { id: 3, nombre: 'Peinado', precio: 180 },
])

function crearFormularioVacio(): FormularioCitaEscritorio {
  return {
    total: 0,
    personal_id: null,
    hora_c: '',
    fecha_c: '',
    estado: 'pendiente',
    cliente_id: null,
    detalles: [
      {
        servicio_id: null,
        subtotal: 0,
      },
    ],
  }
}

const modeloFormulario = ref<FormularioCitaEscritorio>(crearFormularioVacio())

onMounted(() => {
  citaStore.obtenerCitas()
})

async function guardarCita(payload: FormularioCitaEscritorio) {
  if (payload.personal_id === null || payload.cliente_id === null) {
    citaStore.error = 'Selecciona cliente y personal'
    return
  }

  const detallesValidos = payload.detalles
    .filter((detalle) => detalle.servicio_id !== null)
    .map((detalle) => ({
      servicio_id: Number(detalle.servicio_id),
      subtotal: Number(detalle.subtotal),
    }))

  const payloadFinal: CitaEscritorioPayload = {
    total: payload.total,
    personal_id: Number(payload.personal_id),
    hora_c: payload.hora_c,
    fecha_c: payload.fecha_c,
    estado: payload.estado,
    cliente_id: Number(payload.cliente_id),
    detalles: detallesValidos,
  }

  try {
    await citaStore.crearCita(payloadFinal)
    limpiarFormulario()
  } catch (error) {
    console.error('Error al guardar cita:', error)
  }
}

function limpiarFormulario() {
  modeloFormulario.value = crearFormularioVacio()
}
</script>

<template>
  <main class="citas-page">
    <section class="citas-shell">
      <div class="citas-layout">
        
        <!-- SIDEBAR -->
        <aside class="citas-sidebar">
          <span class="panel-tag">Recepción</span>
          <h1>Cita de escritorio</h1>
          <p>
            Registra nuevas citas desde recepción de forma rápida y ordenada.
          </p>

          <div class="sidebar-stats">
            <div class="stat-card">
              <strong>{{ clientes.length }}</strong>
              <span>Clientes disponibles</span>
            </div>

            <div class="stat-card">
              <strong>{{ personales.length }}</strong>
              <span>Personal disponible</span>
            </div>

            <div class="stat-card">
              <strong>{{ servicios.length }}</strong>
              <span>Servicios disponibles</span>
            </div>
          </div>
        </aside>

        <!-- CONTENIDO -->
        <section class="citas-content">
          <div class="top-actions">
            <router-link to="/dashboard/personal" class="back-btn">
              ← Volver al dashboard
            </router-link>
          </div>

          <div class="header">
            <h2>Nueva cita de escritorio</h2>
            <p>Completa la información para registrar la cita.</p>
          </div>

          <div v-if="citaStore.error" class="alert error">
            {{ citaStore.error }}
          </div>

          <div v-if="citaStore.mensaje" class="alert success">
            {{ citaStore.mensaje }}
          </div>

          <div class="card form-card">
            <div class="card-header">
              <h3>Formulario de cita</h3>
              <span>Captura los datos necesarios</span>
            </div>

            <CitaEscritorioForm
              :modelo="modeloFormulario"
              :editando="false"
              :loading="citaStore.loading"
              :clientes="clientes"
              :personales="personales"
              :servicios="servicios"
              @submit="guardarCita"
            />
          </div>
        </section>

      </div>
    </section>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.citas-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #FEFAE0 0%, #FAEDCD 58%, #E9EDC9 100%);
  color: #5f4b3a;
}

.citas-shell {
  width: min(1600px, 100%);
  animation: pageEnter 0.8s ease;
}

.citas-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 780px;
  border-radius: 30px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.56);
  border: 1px solid rgba(255, 255, 255, 0.52);
  box-shadow: 0 22px 60px rgba(92, 75, 59, 0.14);
  backdrop-filter: blur(16px);
}

.citas-sidebar {
  padding: 34px 24px;
  background: linear-gradient(180deg, #CCD5AE 0%, #E9EDC9 100%);
}

.panel-tag {
  display: inline-block;
  margin-bottom: 20px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255,255,255,0.4);
  font-weight: 800;
}

.sidebar-stats {
  margin-top: 20px;
  display: grid;
  gap: 12px;
}

.stat-card {
  padding: 14px;
  border-radius: 14px;
  background: rgba(255,255,255,0.5);
}

.citas-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-btn {
  text-decoration: none;
  font-weight: 800;
  color: #5f4b3a;
}

.header h2 {
  margin: 0;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 20px;
}

.card-header {
  margin-bottom: 12px;
}

.alert {
  padding: 10px;
  border-radius: 10px;
}

.alert.error {
  background: #ffe5e5;
}

.alert.success {
  background: #e5ffe5;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style>