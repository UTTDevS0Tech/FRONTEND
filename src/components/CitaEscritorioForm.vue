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
  permitirEditarCliente?: boolean
  mostrarBotonEditarCliente?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: FormularioCitaEscritorio): void
  (e: 'edit-client'): void
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
    <section class="form-section">
      <div class="section-title">
        <h3>Datos principales</h3>
        <p>Selecciona cliente, personal, fecha y hora.</p>
      </div>

      <div class="grid">
        <div class="field">
          <label>Cliente</label>
          <div class="cliente-field">
            <select v-if="permitirEditarCliente" v-model="formulario.cliente_id" required>
              <option :value="null" disabled>Selecciona cliente</option>
              <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                {{ cliente.nombre }}
              </option>
            </select>

            <input
              v-else
              type="text"
              :value="clientes.find((c) => c.id === formulario.cliente_id)?.nombre || 'Cliente seleccionado'"
              disabled
            />

            <button
              v-if="mostrarBotonEditarCliente"
              type="button"
              class="btn ghost-btn"
              @click="emit('edit-client')"
            >
              Editar
            </button>
          </div>
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
    </section>

    <section class="form-section services-section">
      <div class="services-head">
        <div>
          <h3>Servicios</h3>
          <p>Agrega hasta 3 servicios para la cita.</p>
        </div>

        <button
          type="button"
          class="btn primary add-btn"
          @click="agregarDetalle"
          :disabled="formulario.detalles.length >= 3"
        >
          Agregar servicio
        </button>
      </div>

      <p v-if="formulario.detalles.length >= 3" class="limit-text">
        Máximo 3 servicios
      </p>

      <div class="services-list">
        <article
          v-for="(detalle, index) in formulario.detalles"
          :key="index"
          class="service-card"
        >
          <div class="service-number">
            <span>{{ index + 1 }}</span>
          </div>

          <div class="service-fields">
            <div class="field full">
              <label>Servicio</label>
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
            </div>

            <div class="subtotal-box">
              <span>Subtotal</span>
              <strong>${{ Number(detalle.subtotal || 0) }}</strong>
            </div>
          </div>

          <button type="button" class="btn remove-btn" @click="eliminarDetalle(index)">
            Quitar
          </button>
        </article>
      </div>
    </section>

    <section class="submit-panel">
      <div class="total-box">
        <span>Total calculado</span>
        <strong>${{ totalCalculado }}</strong>
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        {{ editando ? 'Actualizar cita' : 'Guardar cita' }}
      </button>
    </section>
  </form>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.cita-form {
  display: grid;
  gap: 1.4rem;
}

.form-section {
  display: grid;
  gap: 1rem;
  padding: 1.1rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(10px);
}

.section-title h3,
.services-head h3 {
  margin: 0 0 4px;
  color: #5f4b3a;
  font-size: 1.08rem;
  font-weight: 900;
}

.section-title p,
.services-head p,
.limit-text {
  margin: 0;
  color: #8a7764;
  font-size: 0.92rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.field {
  display: grid;
  gap: 0.55rem;
}

.field.full {
  width: 100%;
}

.field label {
  color: #5f4b3a;
  font-weight: 800;
}

.cliente-field {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.services-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.services-list {
  display: grid;
  gap: 14px;
}

.service-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  padding: 16px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(233, 237, 201, 0.3) 0%, rgba(250, 237, 205, 0.18) 100%);
  border: 1px solid rgba(204, 213, 174, 0.24);
}

.service-number {
  width: 44px;
  height: 44px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  background: rgba(204, 213, 174, 0.42);
  color: #556246;
  font-weight: 900;
  flex-shrink: 0;
}

.service-fields {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
  align-items: end;
}

.subtotal-box {
  min-width: 130px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.48);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: grid;
  gap: 4px;
}

.subtotal-box span {
  color: #8a7764;
  font-size: 0.82rem;
}

.subtotal-box strong {
  color: #5f4b3a;
  font-size: 1rem;
}

.submit-panel {
  display: grid;
  gap: 14px;
}

.total-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 1rem 1.1rem;
  border-radius: 20px;
  background: rgba(204, 213, 174, 0.26);
  border: 1px solid rgba(169, 184, 130, 0.22);
  color: #5f4b3a;
}

.total-box span {
  color: #6d7d55;
  font-weight: 800;
}

.total-box strong {
  font-size: 1.18rem;
}

input,
select {
  width: 100%;
  min-width: 0;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: rgba(255, 255, 255, 0.92);
  color: #5f4b3a;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s ease;
  font-family: inherit;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

input::placeholder {
  color: #a08c7a;
  font-weight: 500;
}

input:hover,
select:hover {
  border-color: rgba(212, 163, 115, 0.48);
  background: rgba(255, 255, 255, 0.98);
}

input:focus,
select:focus {
  border-color: #D4A373;
  box-shadow:
    0 0 0 4px rgba(212, 163, 115, 0.14),
    0 8px 16px rgba(212, 163, 115, 0.14);
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 1);
}

input[disabled] {
  background: rgba(255, 255, 255, 0.72);
  color: #7a6858;
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  padding: 1rem 1.1rem;
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #D4A373, #bf8c5a) !important;
  color: white !important;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.25) !important;
  transition: all 0.22s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(212, 163, 115, 0.32);
  filter: brightness(1.02);
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

.ghost-btn {
  padding: 12px 16px;
  background: rgba(204, 213, 174, 0.55);
  color: #4f5f38;
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.08);
}

.ghost-btn:hover {
  transform: translateY(-2px);
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

.add-btn {
  min-width: 170px;
}

option:disabled,
.opcion-inactiva {
  color: #b0a090;
  background: #f5f0eb;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .cliente-field,
  .service-card,
  .service-fields {
    grid-template-columns: 1fr;
  }

  .service-number {
    width: 100%;
    height: 42px;
  }

  .services-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn.primary,
  .submit-btn,
  .remove-btn,
  .ghost-btn {
    width: 100%;
  }

  .total-box {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>