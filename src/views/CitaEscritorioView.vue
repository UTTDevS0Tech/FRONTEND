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
  CitaEscritorioResponse,
} from '@/types/citaEscritorio'

const citaStore = useCitaEscritorioStore()

const editando = ref(false)
const citaEditandoId = ref<number | null>(null)
const modeloFormulario = ref<FormularioCitaEscritorio | null>(null)

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
    console.error(error)
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
    detalles: (cita.detalles || []).map((detalle) => ({
      servicio_id: detalle.servicio_id,
      subtotal: detalle.subtotal,
    })),
  }
}

function cancelarEdicion() {
  editando.value = false
  citaEditandoId.value = null
  modeloFormulario.value = null
}

function limpiarFormulario() {
  modeloFormulario.value = crearFormularioVacio()

  setTimeout(() => {
    modeloFormulario.value = null
  }, 0)
}

async function eliminarCita(id: number) {
  const confirmado = window.confirm('¿Seguro que quieres eliminar esta cita?')
  if (!confirmado) return

  try {
    await citaStore.eliminarCita(id)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
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
        <button v-if="editando" type="button" @click="cancelarEdicion">
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
      <h2>Listado de citas</h2>

      <div v-if="citaStore.loading">Cargando...</div>

      <table v-else class="tabla">
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
              <button type="button" @click="editarCita(cita)">Editar</button>
              <button type="button" @click="eliminarCita(cita.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.citas-page {
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem;
}

.header {
  display: grid;
  gap: 0.3rem;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.alert {
  padding: 0.9rem 1rem;
  border-radius: 12px;
}

.alert.error {
  background: #ffe5e5;
  color: #a10000;
}

.alert.success {
  background: #e8ffef;
  color: #0c7a32;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.tabla th,
.tabla td {
  padding: 0.8rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.acciones {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.6rem 0.9rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
</style>