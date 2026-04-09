<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type {
  ClienteOption,
  PersonalOption,
  FormularioCitaEscritorio,
  FormularioDetalleCita,
} from '@/types/citaEscritorio'
import type { TipoServicio } from '@/types'

const props = defineProps<{
  servicios: TipoServicio[]
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
  if (formulario.detalles.length >= 3) return
  formulario.detalles.push(crearDetalleVacio())
}

function eliminarDetalle(index: number) {
  if (formulario.detalles.length === 1) return
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
    })),
  })
}
</script>

<template>
  <form class="cita-form" @submit.prevent="enviarFormulario">
    <div class="grid">

  <div class="field">
      <label>Cliente</label>
  <input
    type="text"
    :value="clientes.find(c => c.id === formulario.cliente_id)?.nombre || 'Cliente seleccionado'" disabled/>
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
       <button type="button" class= "btn primary" @click="agregarDetalle" :disabled="formulario.detalles.length >= 3"> Agregar servicio </button>
      </div>

      <span v-if="formulario.detalles.length >= 3" style="font-size: 0.9rem; opacity: 0.7;"> Máximo 3 servicios </span>

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
        :disabled="!servicio.activo"
        :class="{ 'opcion-inactiva': !servicio.activo }"
          >
     {{ servicio.nombre }} - ${{ servicio.precio }}{{ !servicio.activo ? ' (No disponible)' : '' }}
        </option>
        </select>

        <button type="button" class="btn remove-btn" @click="eliminarDetalle(index)">
          Quitar
        </button>
      </div>
    </div>

    <div class="total-box">
      <strong>Total: ${{ totalCalculado }}</strong>
    </div>

    <button type="submit" class="submit-btn" :disabled="loading">
      {{ editando ? 'Actualizar cita' : 'Guardar cita' }}
    </button>
  </form>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.cita-form {
  display: grid;
  gap: 1rem;
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

.detalle-row {
  display: grid;
  grid-template-columns: 2fr auto;
  gap: 0.75rem;
  align-items: center;
}

.total-box {
  padding: 0.95rem 1rem;
  border-radius: 16px;
  background: rgba(204, 213, 174, 0.25);
  color: #5f4b3a;
  font-size: 1.05rem;
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

input::placeholder {
  color: #a08c7a;
  font-weight: 500;
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

input[disabled] {
  background: rgba(255, 255, 255, 0.82);
  color: #7a6858;
  cursor: not-allowed;
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

.submit-btn:hover:not(:disabled) {
  background: #c89463 !important;
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(212, 163, 115, 0.32);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.btn.primary {
  padding: 12px 18px;
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.25);
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(212, 163, 115, 0.32);
}

.btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

span {
  color: #8a7764;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .detalle-row {
    grid-template-columns: 1fr;
  }

  .detalles-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn.primary,
  .submit-btn {
    width: 100%;
  }
}

.remove-btn {
  padding: 12px 18px;
  background: rgba(255, 226, 226, 0.95);
  color: #ae4d4d;
  box-shadow: 0 10px 20px rgba(174, 77, 77, 0.12);
}

.remove-btn:hover {
  transform: translateY(-2px);
}

option:disabled,
.opcion-inactiva {
  color: #b0a090;
  background: #f5f0eb;
}
</style>