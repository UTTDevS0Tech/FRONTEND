<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import ClienteRecepcionistaForm from '@/components/ClienteRecepcionistaForm.vue'
import CitaEscritorioForm from '@/components/CitaEscritorioForm.vue'
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

function normalizarHora(valor: string) {
  return valor ? valor.slice(0, 5) : ''
}

function normalizarFecha(valor: string) {
  return valor ? valor.slice(0, 10) : ''
}

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
    hora_c: normalizarHora(cita.hora_c),
    fecha_c: normalizarFecha(cita.fecha_c),
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
    hora_c: normalizarHora(payload.hora_c),
    fecha_c: normalizarFecha(payload.fecha_c),
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

const totalPendientes = computed(() =>
  citaStore.citas.filter((cita) => cita.estado === 'pendiente').length
)

const totalConfirmadas = computed(() =>
  citaStore.citas.filter((cita) => cita.estado === 'confirmada').length
)

async function cambiarEstado(cita: CitaEscritorioResponse, accion: 'confirmar' | 'cancelar' | 'completar') {
  if (accion === 'confirmar') await citaStore.confirmarCita(cita.id)
  if (accion === 'cancelar') await citaStore.cancelarCita(cita.id)
  if (accion === 'completar') await citaStore.completarCita(cita.id)
}
</script>

<template>
  <main class="citas-page">
    <section class="citas-shell">
      <div class="citas-layout">
        <aside class="citas-sidebar">
          <span class="panel-tag">Recepción</span>
          <h1>Citas pendientes</h1>
          <p>
            Consulta las citas registradas, filtra por cliente y administra cada ticket
            desde una vista clara y ordenada.
          </p>

          <div class="sidebar-stats">
            <div class="stat-card">
              <strong>{{ citaStore.citas.length }}</strong>
              <span>Citas registradas</span>
            </div>

            <div class="stat-card">
              <strong>{{ totalPendientes }}</strong>
              <span>Pendientes</span>
            </div>

            <div class="stat-card">
              <strong>{{ totalConfirmadas }}</strong>
              <span>Confirmadas</span>
            </div>
          </div>
        </aside>

        <section class="citas-content">
          <div class="top-actions">
            <router-link to="/dashboard/personal" class="back-btn">
              ← Volver al dashboard
            </router-link>
          </div>

          <div class="page-header">
            <h2>Gestión de citas</h2>
            <p>Busca por cliente, revisa los detalles y actualiza el estado de cada cita.</p>
          </div>

          <div class="content-card toolbar-card">
            <div class="toolbar-copy">
              <h3>Buscar cita</h3>
              <p>Filtra rápidamente por el nombre del cliente.</p>
            </div>

            <input
              v-model="search"
              type="text"
              placeholder="Buscar por cliente..."
              class="search-input"
            />
          </div>

          <div v-if="citaStore.loading" class="content-card empty-state">
            <h3>Cargando citas...</h3>
          </div>

          <div v-else-if="citaStore.error" class="content-card empty-state error-state">
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
                  class="action-btn confirm"
                  @click="cambiarEstado(cita, 'confirmar')"
                >
                  Confirmar
                </button>

                <button
                  v-if="cita.estado !== 'completada'"
                  type="button"
                  class="action-btn danger"
                  @click="cambiarEstado(cita, 'cancelar')"
                >
                  Cancelar
                </button>

                <button
                  v-if="cita.estado !== 'cancelada'"
                  type="button"
                  class="action-btn complete"
                  @click="cambiarEstado(cita, 'completar')"
                >
                  Completar
                </button>

                <button
                  v-if="cita.estado !== 'cancelada' && cita.estado !== 'completada'"
                  type="button"
                  class="action-btn neutral"
                  @click="abrirModalReagendar(cita)"
                >
                  Reagendar
                </button>
              </div>
            </article>
          </div>

          <div v-else class="content-card empty-state">
            <h3>No hay citas pendientes</h3>
            <p>No se encontraron tickets con el filtro actual.</p>
          </div>
        </section>
      </div>
    </section>

    <div v-if="modalReagendarAbierto" class="modal-backdrop">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3>Reagendar cita</h3>
            <p>Actualiza la información necesaria para esta cita.</p>
          </div>

          <button type="button" class="close-btn" @click="cerrarModalReagendar">
            ✕
          </button>
        </div>

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

        <div class="modal-form-shell">
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
        </div>
      </div>
    </div>

    <div v-if="modalEditarClienteAbierto" class="modal-backdrop secondary-backdrop">
      <div class="modal-card client-modal-card">
        <div class="modal-header">
          <div>
            <h3>Editar cliente</h3>
            <p>Modifica los datos del cliente vinculado a la cita.</p>
          </div>

          <button type="button" class="close-btn" @click="cerrarModalEditarCliente">
            ✕
          </button>
        </div>

        <p v-if="recepcionistaStore.error" class="modal-feedback error-text">
          {{ recepcionistaStore.error }}
        </p>

        <p v-if="recepcionistaStore.mensaje" class="modal-feedback success-text">
          {{ recepcionistaStore.mensaje }}
        </p>

        <div class="modal-form-shell">
          <ClienteRecepcionistaForm
            :formulario="formularioCliente"
            submit-label="Guardar cliente"
            @submit="guardarClienteEditado"
          />
        </div>
      </div>
    </div>
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
  padding: 22px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
  color: #5f4b3a;
}

.citas-shell {
  width: min(1680px, 100%);
  animation: pageEnter 0.8s ease;
}

.citas-layout {
  display: grid;
  grid-template-columns: 270px 1fr;
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
  background: linear-gradient(180deg, #ccd5ae 0%, #e9edc9 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.panel-tag {
  display: inline-block;
  width: fit-content;
  margin-bottom: 24px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.42);
  color: #6d5844;
  font-weight: 800;
  font-size: 0.95rem;
}

.citas-sidebar h1 {
  margin: 0 0 16px;
  font-size: 2.3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.citas-sidebar p {
  margin: 0 0 24px;
  color: #7b6a58;
  line-height: 1.7;
  font-size: 0.95rem;
}

.sidebar-stats {
  display: grid;
  gap: 18px;
  margin-top: 12px;
}

.stat-card {
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.45);
  box-shadow: 0 10px 24px rgba(92, 75, 59, 0.08);
}

.stat-card strong {
  display: block;
  margin-bottom: 8px;
  font-size: 1.8rem;
  color: #5f4b3a;
}

.stat-card span {
  color: #7b6a58;
  font-weight: 600;
}

.citas-content {
  padding: 24px 28px;
  background: rgba(254, 250, 224, 0.88);
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.top-actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.back-btn {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 0.95rem;
  text-decoration: none;
  transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
  background: rgba(204, 213, 174, 0.55);
  color: #5f4b3a;
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.08);
}

.back-btn:hover {
  transform: translateY(-2px);
  background: rgba(204, 213, 174, 0.78);
  box-shadow: 0 14px 24px rgba(92, 75, 59, 0.12);
}

.page-header {
  display: grid;
  gap: 0.35rem;
}

.page-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #5f4b3a;
}

.page-header p {
  margin: 0;
  color: #8a7764;
  font-size: 0.95rem;
}

.content-card,
.ticket-card,
.empty-state {
  background: rgba(255, 255, 255, 0.62);
  border-radius: 28px;
  border: 1px solid rgba(236, 231, 216, 0.7);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
}

.toolbar-card {
  padding: 20px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.toolbar-copy h3 {
  margin: 0 0 6px;
  color: #5f4b3a;
  font-size: 1.2rem;
}

.toolbar-copy p {
  margin: 0;
  color: #8a7764;
}

.search-input {
  min-width: 280px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: rgba(255, 255, 255, 0.92);
  color: #5f4b3a;
  outline: none;
  transition: all 0.22s ease;
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

.estado-badge.completada {
  background: rgba(222, 244, 227, 0.95);
  color: #3f7a4a;
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
  background: rgba(255, 255, 255, 0.78);
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

.error-state {
  background: rgba(255, 244, 244, 0.9);
}

.ticket-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.action-btn {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 800;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn.confirm {
  background: rgba(204, 213, 174, 0.45);
  color: #4f5f38;
}

.action-btn.danger {
  background: rgba(255, 226, 226, 0.95);
  color: #ae4d4d;
}

.action-btn.complete {
  background: rgba(222, 244, 227, 0.95);
  color: #3f7a4a;
}

.action-btn.neutral {
  background: rgba(212, 163, 115, 0.16);
  color: #8d633c;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(45, 34, 24, 0.45);
  z-index: 200;
}

.modal-card {
  width: min(100%, 920px);
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: 28px;
  background: #fffaf0;
  box-shadow: 0 24px 50px rgba(45, 34, 24, 0.22);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.modal-header h3 {
  margin: 0 0 6px;
  color: #5f4b3a;
  font-size: 1.45rem;
}

.modal-header p {
  margin: 0;
  color: #8a7764;
}

.close-btn {
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 900;
  background: rgba(255, 226, 226, 0.95);
  color: #a14444;
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
  width: min(100%, 760px);
}

.modal-form-shell {
  padding: 4px 0;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1250px) {
  .citas-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .toolbar-card {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    min-width: 0;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .citas-page {
    padding: 16px;
  }

  .citas-content {
    padding: 18px;
  }

  .ticket-card,
  .toolbar-card {
    padding: 18px;
    border-radius: 22px;
  }

  .modal-card {
    padding: 18px;
    border-radius: 22px;
  }

  .page-header h2 {
    font-size: 1.5rem;
  }
}
</style>