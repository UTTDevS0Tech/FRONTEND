<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CitaEscritorioForm from '@/components/CitaEscritorioForm.vue'
import { useCitaEscritorioStore } from '@/stores/citaEscritorio'
import type {
  ClienteOption,
  PersonalOption,
  ServicioOption,
  FormularioCitaEscritorio,
  CitaEscritorioPayload,
  CitaEscritorioResponse,
} from '@/types/citaEscritorio'

const citaStore = useCitaEscritorioStore()

const editando = ref(false)
const citaEditandoId = ref<number | null>(null)

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
    if (editando.value && citaEditandoId.value !== null) {
      await citaStore.actualizarCita(citaEditandoId.value, payloadFinal)
      cancelarEdicion()
      return
    }

    await citaStore.crearCita(payloadFinal)
    limpiarFormulario()
  } catch (error) {
    console.error('Error al guardar cita:', error)
  }
}

function editarCita(cita: CitaEscritorioResponse) {
  editando.value = true
  citaEditandoId.value = cita.id

  modeloFormulario.value = {
    total: cita.total,
    personal_id: cita.personal_id,
    hora_c: cita.hora_c,
    fecha_c: cita.fecha_c,
    estado: cita.estado || 'pendiente',
    cliente_id: cita.cliente_id,
    detalles: (cita.detalles && cita.detalles.length > 0)
      ? cita.detalles.map((detalle) => ({
          servicio_id: detalle.servicio_id,
          subtotal: detalle.subtotal,
        }))
      : [
          {
            servicio_id: null,
            subtotal: 0,
          },
        ],
  }
}

function cancelarEdicion() {
  editando.value = false
  citaEditandoId.value = null
  modeloFormulario.value = crearFormularioVacio()
}

function limpiarFormulario() {
  modeloFormulario.value = crearFormularioVacio()
}

async function eliminarCita(id: number) {
  const confirmado = window.confirm('¿Seguro que quieres eliminar esta cita?')
  if (!confirmado) return

  try {
    await citaStore.eliminarCita(id)
  } catch (error) {
    console.error('Error al eliminar cita:', error)
  }
}
</script>

<template>

  <div style="background:red;color:white;padding:30px;font-size:32px;">
    CITA ESCRITORIO VIEW CARGADA
  </div>

  <section class="citas-page">
    <div class="header">
      <h1>Citas de escritorio</h1>
      <p>Aquí puedes registrar y administrar las citas desde recepción.</p>
    </div>

    <div v-if="citaStore.error" class="alert error">
      {{ citaStore.error }}
    </div>

    <div v-if="citaStore.mensaje" class="alert success">
      {{ citaStore.mensaje }}
    </div>

    <div class="card">
      <div class="card-header">
        <h2>{{ editando ? 'Editar cita' : 'Nueva cita' }}</h2>

        <button
          v-if="editando"
          type="button"
          class="btn secondary"
          @click="cancelarEdicion"
        >
          Cancelar
        </button>
      </div>

      <CitaEscritorioForm
        :modelo="modeloFormulario"
        :editando="editando"
        :loading="citaStore.loading"
        :clientes="clientes"
        :personales="personales"
        :servicios="servicios"
        @submit="guardarCita"
      />
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Listado de citas</h2>
      </div>

      <div v-if="citaStore.loading" class="empty-state">
        Cargando citas...
      </div>

      <div v-else-if="!citaStore.citas.length" class="empty-state">
        No hay citas registradas todavía.
      </div>

      <div v-else class="table-wrap">
        <table class="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Personal</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="cita in citaStore.citas" :key="cita.id">
              <td>{{ cita.id }}</td>
              <td>{{ cita.cliente?.nombre || cita.cliente_id }}</td>
              <td>{{ cita.personal?.nombre || cita.personal_id }}</td>
              <td>{{ cita.fecha_c }}</td>
              <td>{{ cita.hora_c }}</td>
              <td>${{ cita.total }}</td>
              <td class="acciones">
                <button
                  type="button"
                  class="btn warning"
                  @click="editarCita(cita)"
                >
                  Editar
                </button>

                <button
                  type="button"
                  class="btn danger"
                  @click="eliminarCita(cita.id)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.citas-page {
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem;
  min-height: 100vh;
  background: #f6f1df;
  color: #1f2937;
}

.header {
  display: grid;
  gap: 0.35rem;
}

.header h1 {
  margin: 0;
  font-size: 2rem;
  color: #111827;
}

.header p {
  margin: 0;
  color: #4b5563;
}

.card {
  background: #ffffff;
  border-radius: 18px;
  padding: 1.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #ece7d8;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #111827;
}

.alert {
  padding: 0.95rem 1rem;
  border-radius: 12px;
  font-weight: 500;
}

.alert.error {
  background: #ffe5e5;
  color: #991b1b;
  border: 1px solid #f5bcbc;
}

.alert.success {
  background: #e8ffef;
  color: #166534;
  border: 1px solid #bde8c8;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

.tabla th {
  background: #f8fafc;
  color: #374151;
  font-weight: 700;
}

.tabla th,
.tabla td {
  padding: 0.9rem 0.8rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.tabla tbody tr:hover {
  background: #faf7ee;
}

.acciones {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.65rem 0.95rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn.secondary {
  background: #e5e7eb;
  color: #111827;
}

.btn.warning {
  background: #facc15;
  color: #111827;
}

.btn.danger {
  background: #ef4444;
  color: white;
}

.empty-state {
  padding: 1rem 0.25rem;
  color: #6b7280;
  font-weight: 500;
}

@media (max-width: 768px) {
  .citas-page {
    padding: 1rem;
  }

  .card {
    padding: 1rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header h1 {
    font-size: 1.6rem;
  }
}
</style>