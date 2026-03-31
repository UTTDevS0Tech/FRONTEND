<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type {
  ClienteOption,
  PersonalOption,
  ServicioOption,
  FormularioCitaEscritorio,
  FormularioDetalleCita,
} from '@/types/citaEscritorio'

const props = defineProps<{
  servicios: ServicioOption[]
  personales: PersonalOption[]
  clientes: ClienteOption[]
  modelo?: FormularioCitaEscritorio | null
  editando?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: FormularioCitaEscritorio): void
}>()

function crearDetalleVacio(): FormularioDetalleCita {
  return {
    servicio_id: null,
    subtotal: 0,
  }
}

function crearFormularioVacio(): FormularioCitaEscritorio {
  return {
    total: 0,
    personal_id: null,
    hora_c: '',
    fecha_c: '',
    estado: 'pendiente',
    cliente_id: null,
    detalles: [crearDetalleVacio()],
  }
}

const formulario = reactive<FormularioCitaEscritorio>(crearFormularioVacio())

watch(
  () => props.modelo,
  (nuevo) => {
    if (!nuevo) {
      Object.assign(formulario, crearFormularioVacio())
      return
    }

    formulario.total = nuevo.total
    formulario.personal_id = nuevo.personal_id
    formulario.hora_c = nuevo.hora_c
    formulario.fecha_c = nuevo.fecha_c
    formulario.estado = nuevo.estado
    formulario.cliente_id = nuevo.cliente_id
    formulario.detalles = nuevo.detalles.length
      ? nuevo.detalles.map((detalle) => ({
          servicio_id: detalle.servicio_id,
          subtotal: detalle.subtotal,
        }))
      : [crearDetalleVacio()]
  },
  { immediate: true, deep: true }
)

function agregarDetalle() {
  formulario.detalles.push(crearDetalleVacio())
}

function eliminarDetalle(index: number) {
  if (formulario.detalles.length === 1) return
  if (!formulario.detalles[index]) return

  formulario.detalles.splice(index, 1)
}

function actualizarSubtotal(index: number) {
  const detalle = formulario.detalles[index]

  if (!detalle) return

  const servicio = props.servicios.find((s) => s.id === detalle.servicio_id)
  detalle.subtotal = servicio ? Number(servicio.precio) : 0
}

const totalCalculado = computed(() => {
  return formulario.detalles.reduce((acumulado, detalle) => {
    return acumulado + Number(detalle.subtotal || 0)
  }, 0)
})

watch(
  totalCalculado,
  (nuevoTotal) => {
    formulario.total = nuevoTotal
  },
  { immediate: true }
)

function enviarFormulario() {
  emit('submit', {
    total: formulario.total,
    personal_id: formulario.personal_id,
    hora_c: formulario.hora_c,
    fecha_c: formulario.fecha_c,
    estado: formulario.estado,
    cliente_id: formulario.cliente_id,
    detalles: formulario.detalles.map((detalle) => ({
      servicio_id: detalle.servicio_id,
      subtotal: Number(detalle.subtotal),
    })) as FormularioDetalleCita[],
  })
}
</script>

<template>
  <form class="cita-form" @submit.prevent="enviarFormulario">
    <div class="grid">
      <div class="field">
        <label>Cliente</label>
        <select v-model="formulario.cliente_id" required>
          <option :value="null" disabled>Selecciona un cliente</option>
          <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
            {{ cliente.nombre }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>Personal</label>
        <select v-model="formulario.personal_id" required>
          <option :value="null" disabled>Selecciona personal</option>
          <option v-for="persona in personales" :key="persona.id" :value="persona.id">
            {{ persona.nombre }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>Fecha</label>
        <input v-model="formulario.fecha_c" type="date" required />
      </div>

      <div class="field">
        <label>Hora</label>
        <input v-model="formulario.hora_c" type="time" required />
      </div>
    </div>

    <div class="detalles">
      <div class="detalles-header">
        <h3>Servicios</h3>
        <button type="button" @click="agregarDetalle">Agregar servicio</button>
      </div>

      <div
        v-for="(detalle, index) in formulario.detalles"
        :key="index"
        class="detalle-row"
      >
        <select
          v-model="detalle.servicio_id"
          @change="actualizarSubtotal(index)"
          required
        >
          <option :value="null" disabled>Selecciona un servicio</option>
          <option
            v-for="servicio in servicios"
            :key="servicio.id"
            :value="servicio.id"
          >
            {{ servicio.nombre }} - ${{ servicio.precio }}
          </option>
        </select>

        <input
          v-model.number="detalle.subtotal"
          type="number"
          min="0"
          step="0.01"
          placeholder="Subtotal"
          required
        />

        <button type="button" @click="eliminarDetalle(index)">
          Quitar
        </button>
      </div>
    </div>

    <div class="total-box">
      <strong>Total: ${{ totalCalculado }}</strong>
    </div>

    <button type="submit" :disabled="loading">
      {{ editando ? 'Actualizar cita' : 'Guardar cita' }}
    </button>
  </form>
</template>

<style scoped>
.cita-form {
  display: grid;
  gap: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.field {
  display: grid;
  gap: 0.4rem;
}

.detalles {
  display: grid;
  gap: 1rem;
}

.detalles-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detalle-row {
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: 0.75rem;
}

.total-box {
  font-size: 1.1rem;
}

input,
select,
button {
  padding: 0.7rem;
  border-radius: 10px;
  border: 1px solid #ccc;
}
</style>