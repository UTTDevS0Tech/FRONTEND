<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import ClienteRecepcionistaForm from '@/components/ClienteRecepcionistaForm.vue'
import CitaEscritorioForm from '@/components/citaEscritorioForm.vue'
import { useCitaEscritorioStore } from '@/stores/citaEscritorio'
import { useClienteStore } from '@/stores/cliente'
import { usePersonalStore } from '@/stores/personal'
import { useRecepcionistaStore } from '@/stores/recepcionista'
import { useTipoServiciosStore } from '@/stores/tipoServicios'
import type {
  CitaEscritorioPayload,
  CitaEscritorioResponse,
  DetalleCitaEditable,
  FormularioCitaEscritorio,
} from '@/types/citaEscritorio'
import type { Cliente } from '@/types'

const citaStore = useCitaEscritorioStore()
const clienteStore = useClienteStore()
const personalStore = usePersonalStore()
const recepcionistaStore = useRecepcionistaStore()
const tipoServicioStore = useTipoServiciosStore()
const search = ref('')

const modalReagendarAbierto = ref(false)
const modalEditarClienteAbierto = ref(false)
const citaEditando = ref<CitaEscritorioResponse | null>(null)
const clienteEditando = ref<Cliente | null>(null)
const modeloFormularioEdicion = ref<FormularioCitaEscritorio | null>(null)
const formularioCliente = reactive({
  nom: '',
  apellido_p: '',
  apellido_m: '',
  tel: '',
})

onMounted(() => {
  citaStore.obtenerCitas()
  clienteStore.obtenerClientes()
  personalStore.obtenerPersonales()
  recepcionistaStore.buscarClientes()
  tipoServicioStore.obtenerTiposServicio()
})

function abrirModalReagendar(cita: CitaEscritorioResponse) {
  citaStore.limpiarMensajes()
  citaEditando.value = cita
  modeloFormularioEdicion.value = {
    total: Number(cita.total),
    personal_id: cita.personal_id,
    hora_c: cita.hora_c,
    fecha_c: cita.fecha_c,
    estado: cita.estado,
    cliente_id: cita.cliente_id,
    detalles: cita.detalles.length
      ? cita.detalles.map((detalle) => ({
          servicio_id: detalle.servicio_id,
          subtotal: obtenerSubtotalDetalle(detalle),
        }))
      : [
          {
            servicio_id: null,
            subtotal: 0,
          },
        ],
  }
  modalReagendarAbierto.value = true
}

function cerrarModalReagendar() {
  citaEditando.value = null
  modeloFormularioEdicion.value = null
  modalReagendarAbierto.value = false
}

function abrirModalEditarCliente() {
  if (!citaEditando.value) return

  const cliente = recepcionistaStore.clientes.find((item) => item.id === citaEditando.value?.cliente_id)

  if (!cliente) {
    recepcionistaStore.error = 'No se encontraron los datos del cliente para editar'
    return
  }

  clienteEditando.value = cliente
  formularioCliente.nom = cliente.nom
  formularioCliente.apellido_p = cliente.apellido_p
  formularioCliente.apellido_m = cliente.apellido_m
  formularioCliente.tel = cliente.tel || ''
  modalEditarClienteAbierto.value = true
}

function cerrarModalEditarCliente() {
  clienteEditando.value = null
  formularioCliente.nom = ''
  formularioCliente.apellido_p = ''
  formularioCliente.apellido_m = ''
  formularioCliente.tel = ''
  modalEditarClienteAbierto.value = false
}

function obtenerNombreCliente(cita: CitaEscritorioResponse) {
  return cita.cliente || `Cliente #${cita.cliente_id}`
}

function obtenerNombrePersonal(cita: CitaEscritorioResponse) {
  return cita.personal || `Personal #${cita.personal_id}`
}

function obtenerSubtotalDetalle(detalle: DetalleCitaEditable) {
  return Number(detalle.subtotal ?? detalle.precio_capturado ?? 0)
}

async function guardarReagendado(payload: FormularioCitaEscritorio) {
  if (!citaEditando.value || payload.personal_id === null || payload.cliente_id === null) {
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
    total: Number(payload.total),
    personal_id: Number(payload.personal_id),
    hora_c: payload.hora_c,
    fecha_c: payload.fecha_c,
    estado: payload.estado,
    cliente_id: Number(payload.cliente_id),
    detalles: detallesValidos,
  }

  await citaStore.actualizarCita(citaEditando.value.id, payloadFinal)
  cerrarModalReagendar()
}

async function guardarClienteEditado() {
  if (!clienteEditando.value?.id) return

  await recepcionistaStore.actualizarCliente(clienteEditando.value.id, {
    nom: formularioCliente.nom,
    apellido_p: formularioCliente.apellido_p,
    apellido_m: formularioCliente.apellido_m,
    tel: formularioCliente.tel,
  })

  await Promise.all([
    recepcionistaStore.buscarClientes(),
    clienteStore.obtenerClientes(),
    citaStore.obtenerCitas(),
  ])

  if (citaEditando.value) {
    const nombreActualizado = `${formularioCliente.nom} ${formularioCliente.apellido_p} ${formularioCliente.apellido_m}`.trim()
    citaEditando.value = {
      ...citaEditando.value,
      cliente: nombreActualizado,
    }
  }

  cerrarModalEditarCliente()
}

const citasFiltradas = computed(() => {
  const texto = search.value.trim().toLowerCase()

  if (!texto) return citaStore.citas

  return citaStore.citas.filter((cita) => {
    const nombreCliente = obtenerNombreCliente(cita)
    return nombreCliente.toLowerCase().includes(texto)
  })
})

async function cambiarEstado(cita: CitaEscritorioResponse, accion: 'confirmar' | 'cancelar' | 'completar') {
  if (accion === 'confirmar') await citaStore.confirmarCita(cita.id)
  if (accion === 'cancelar') await citaStore.cancelarCita(cita.id)
  if (accion === 'completar') await citaStore.completarCita(cita.id)
}
</script>

<template>
  <main class="citas-page">
    <section class="card">
      <div class="card-header">
        <div>
          <h1>Citas pendientes</h1>
          <p>Consulta todos los tickets del sistema y filtra por cliente.</p>
        </div>

        <input
          v-model="search"
          type="text"
          placeholder="Buscar por cliente..."
          class="search-input"
        />
      </div>

      <div v-if="citaStore.loading" class="empty-state">
        <h3>Cargando citas...</h3>
      </div>

      <div v-else-if="citaStore.error" class="empty-state">
        <h3>Error al obtener citas</h3>
        <p>{{ citaStore.error }}</p>
      </div>

      <div v-else-if="citasFiltradas.length" class="tickets-grid">
        <article v-for="cita in citasFiltradas" :key="cita.id" class="ticket-card">
          <div class="ticket-head">
            <div>
              <h3>Ticket #{{ cita.id }}</h3>
              <p>{{ obtenerNombreCliente(cita) }}</p>
            </div>

            <span class="estado-badge" :class="cita.estado">
              {{ cita.estado }}
            </span>
          </div>

          <div class="ticket-meta">
            <p><strong>Personal:</strong> {{ obtenerNombrePersonal(cita) }}</p>
            <p><strong>Fecha:</strong> {{ cita.fecha_c }}</p>
            <p><strong>Hora:</strong> {{ cita.hora_c }}</p>
            <p><strong>Hora fin:</strong> {{ cita.hora_fin || 'Sin definir' }}</p>
            <p><strong>Apartado:</strong> ${{ cita.apartado }}</p>
          </div>

          <div class="ticket-body">
            <h4>Detalle de la cita</h4>

            <div
              v-for="(detalle, index) in cita.detalles || []"
              :key="index"
              class="detalle-item"
            >
              <span>{{ detalle.servicio }}</span>
              <strong>${{ obtenerSubtotalDetalle(detalle).toFixed(2) }}</strong>
            </div>
          </div>

          <div class="ticket-footer">
            <strong>Total: ${{ cita.total }}</strong>
          </div>

          <div class="ticket-actions">
            <button
              v-if="!['cancelada', 'completada'].includes(cita.estado)"
              type="button"
              @click="cambiarEstado(cita, 'confirmar')"
            >
              Confirmar
            </button>

            <button
              v-if="cita.estado !== 'completada'"
              type="button"
              @click="cambiarEstado(cita, 'cancelar')"
            >
              Cancelar
            </button>

            <button
              v-if="cita.estado !== 'cancelada'"
              type="button"
              @click="cambiarEstado(cita, 'completar')"
            >
              Completar
            </button>

            <button
              v-if="cita.estado !== 'cancelada' && cita.estado !== 'completada'"
              type="button"
              @click="abrirModalReagendar(cita)"
            >
              Reagendar
            </button>
          </div>
        </article>
      </div>

      <div v-else class="empty-state">
        <h3>No hay citas pendientes</h3>
        <p>No se encontraron tickets con el filtro actual.</p>
      </div>
    </section>

    <div v-if="modalReagendarAbierto" class="modal-backdrop">
      <div class="modal-card">
        <h3>Reagendar cita</h3>

        <p v-if="clienteStore.error" class="modal-feedback error-text">
          {{ clienteStore.error }}
        </p>

        <p v-if="personalStore.error" class="modal-feedback error-text">
          {{ personalStore.error }}
        </p>

        <p v-if="tipoServicioStore.error" class="modal-feedback error-text">
          {{ tipoServicioStore.error }}
        </p>

        <p v-if="citaStore.error" class="modal-feedback error-text">
          {{ citaStore.error }}
        </p>

        <CitaEscritorioForm
          v-if="modeloFormularioEdicion"
          :modelo="modeloFormularioEdicion"
          :editando="true"
          :permitir-editar-cliente="true"
          :mostrar-boton-editar-cliente="true"
          :loading="
            citaStore.loading ||
            clienteStore.loading ||
            personalStore.loading ||
            tipoServicioStore.cargando
          "
          :clientes="clienteStore.clientes"
          :personales="personalStore.personales"
          :servicios="tipoServicioStore.tipoServicios"
          @edit-client="abrirModalEditarCliente"
          @submit="guardarReagendado"
        />

        <div class="modal-actions">
          <button type="button" @click="cerrarModalReagendar">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <div v-if="modalEditarClienteAbierto" class="modal-backdrop secondary-backdrop">
      <div class="modal-card client-modal-card">
        <h3>Editar cliente</h3>

        <p v-if="recepcionistaStore.error" class="modal-feedback error-text">
          {{ recepcionistaStore.error }}
        </p>

        <p v-if="recepcionistaStore.mensaje" class="modal-feedback success-text">
          {{ recepcionistaStore.mensaje }}
        </p>

        <ClienteRecepcionistaForm
          :formulario="formularioCliente"
          submit-label="Guardar cliente"
          @submit="guardarClienteEditado"
        />

        <div class="modal-actions">
          <button type="button" @click="cerrarModalEditarCliente">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.citas-page {
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
}

.card {
  max-width: 1280px;
  margin: 0 auto;
  padding: 28px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 22px 60px rgba(92, 75, 59, 0.14);
  backdrop-filter: blur(16px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.card-header h1 {
  margin: 0 0 8px;
  font-size: 2rem;
  color: #5f4b3a;
}

.card-header p {
  margin: 0;
  color: #8a7764;
}

.search-input {
  min-width: 260px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: rgba(255, 255, 255, 0.92);
  color: #5f4b3a;
  outline: none;
}

.search-input:focus {
  border-color: #d4a373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
}

.ticket-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px;
  border-radius: 24px;
  background: rgba(254, 250, 224, 0.88);
  border: 1px solid rgba(212, 163, 115, 0.12);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
}

.ticket-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.ticket-head h3 {
  margin: 0 0 6px;
  color: #5f4b3a;
  font-size: 1.3rem;
}

.ticket-head p {
  margin: 0;
  color: #7b6a58;
  font-weight: 700;
}

.estado-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: capitalize;
}

.estado-badge.pendiente {
  background: rgba(250, 237, 205, 0.95);
  color: #9b6a3b;
}

.estado-badge.confirmada {
  background: rgba(204, 213, 174, 0.45);
  color: #536437;
}

.estado-badge.cancelada {
  background: rgba(255, 226, 226, 0.95);
  color: #ae4d4d;
}

.ticket-meta {
  display: grid;
  gap: 8px;
}

.ticket-meta p,
.ticket-body h4,
.empty-state p,
.empty-state h3 {
  margin: 0;
}

.ticket-meta p {
  color: #6e5a47;
}

.ticket-body {
  display: grid;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px dashed rgba(95, 75, 58, 0.18);
}

.ticket-body h4 {
  color: #5f4b3a;
  font-size: 1rem;
}

.detalle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.75);
  color: #5f4b3a;
}

.ticket-footer {
  padding-top: 10px;
  border-top: 1px solid rgba(95, 75, 58, 0.08);
  color: #5f4b3a;
  font-size: 1.05rem;
}

.empty-state {
  padding: 36px 18px;
  text-align: center;
}

.empty-state h3 {
  color: #5f4b3a;
  margin-bottom: 8px;
}

.empty-state p {
  color: #8a7764;
}

.ticket-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.ticket-actions button {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 700;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(45, 34, 24, 0.45);
}

.modal-card {
  width: min(100%, 880px);
  display: grid;
  gap: 14px;
  padding: 24px;
  border-radius: 24px;
  background: #fffaf0;
  box-shadow: 0 24px 50px rgba(45, 34, 24, 0.22);
}

.modal-card h3 {
  margin: 0;
  color: #5f4b3a;
}

.modal-field {
  display: grid;
  gap: 8px;
  color: #6e5a47;
  font-weight: 700;
}

.modal-field input,
.modal-field select {
  padding: 12px 14px;
  border: 1px solid rgba(212, 163, 115, 0.32);
  border-radius: 14px;
  background: #fff;
  color: #5f4b3a;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-feedback {
  margin: 0;
  font-weight: 600;
}

.error-text {
  color: #ae4d4d;
}

.success-text {
  color: #536437;
}

.secondary-backdrop {
  background: rgba(45, 34, 24, 0.58);
}

.client-modal-card {
  width: min(100%, 720px);
}

@media (max-width: 768px) {
  .citas-page {
    padding: 18px;
  }

  .card {
    padding: 20px;
  }
}
</style>
