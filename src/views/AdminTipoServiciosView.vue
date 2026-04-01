<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TipoServicioForm from '@/components/TipoServicioForm.vue'
import { useServiciosStore } from '@/stores/servicios'
import { useTipoServiciosStore } from '@/stores/tipoServicios'
import type { TipoServicio } from '@/types'

const serviciosStore = useServiciosStore()
const tipoServiciosStore = useTipoServiciosStore()

const seleccionado = ref<TipoServicio | null>(null)
const modalAbierto = ref(false)

const totalActivos = computed(() =>
  tipoServiciosStore.tipoServicios.filter(tipo => tipo.activo).length
)

async function cargarTodo() {
  try {
    await Promise.all([
      serviciosStore.obtenerServicios(),
      tipoServiciosStore.obtenerTiposServicio()
    ])
  } catch (err) {
    console.error('Error al cargar datos iniciales:', err)
  }
}

async function guardar(payload: FormData) {
  try {
    if (seleccionado.value?.id) {
      await tipoServiciosStore.actualizarTipoServicio(seleccionado.value.id, payload)
    } else {
      await tipoServiciosStore.crearTipoServicio(payload)
    }

    limpiarSeleccion()
    modalAbierto.value = false
  } catch (err) {
    console.error('Error al guardar tipo de servicio:', err)
  }
}

function editar(item: TipoServicio) {
  seleccionado.value = {
    ...item,
    precio: Number(item.precio),
    tiempo_estimado: Number(item.tiempo_estimado),
    servicio_id: Number(item.servicio_id),
    activo: Boolean(item.activo)
  }
  modalAbierto.value = true
}

function limpiarSeleccion() {
  seleccionado.value = null
}

function abrirModalNuevo() {
  limpiarSeleccion()
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
  limpiarSeleccion()
}

async function eliminar(id?: number) {
  if (!id) return

  const confirmar = confirm('¿Seguro que deseas eliminar este tipo de servicio?')
  if (!confirmar) return

  try {
    await tipoServiciosStore.eliminarTipoServicio(id)

    if (seleccionado.value?.id === id) {
      limpiarSeleccion()
    }
  } catch (err) {
    console.error('Error al eliminar tipo de servicio:', err)
  }
}

async function toggleEstado(id?: number) {
  if (!id) return

  try {
    await tipoServiciosStore.toggleTipoServicio(id)
  } catch (err) {
    console.error('Error al cambiar estado:', err)
  }
}

function obtenerNombreServicio(servicioId?: number) {
  if (!servicioId) return 'Sin servicio'
  const servicio = serviciosStore.servicios.find(item => item.id === servicioId)
  return servicio?.nombre || `#${servicioId}`
}

onMounted(() => {
  cargarTodo()
})
</script>

<template>
  <main class="tipos-page">
    <section class="tipos-shell">
      <div class="tipos-layout">
        <aside class="tipos-sidebar">
          <span class="panel-tag">Administración</span>
          <h1>Tipos de Servicio</h1>
          <p>
            Gestiona los tipos de servicio de la estética. Aquí puedes registrar variantes
            específicas, asignarlas a un servicio base y definir su precio, duración e imagen.
          </p>

          <div class="sidebar-stats">
            <div class="stat-card">
              <strong>{{ serviciosStore.servicios.length }}</strong>
              <span>Servicios base disponibles</span>
            </div>

            <div class="stat-card">
              <strong>{{ totalActivos }}</strong>
              <span>Tipos activos</span>
            </div>
          </div>
        </aside>

        <section class="tipos-content">
          <div class="top-actions">
            <router-link to="/dashboard/admin" class="back-btn">
              ← Volver al dashboard
            </router-link>

            <button type="button" class="new-btn" @click="abrirModalNuevo">
              + Nuevo tipo de servicio
            </button>
          </div>

          <div class="page-header">
            <div>
              <h2>Tipos de servicio registrados</h2>
              <p>Consulta, edita y administra los tipos de servicio del sistema.</p>
            </div>
          </div>

          <div v-if="tipoServiciosStore.mensaje" class="mensaje-exito">
            {{ tipoServiciosStore.mensaje }}
          </div>

          <div v-if="tipoServiciosStore.error" class="mensaje-error">
            {{ tipoServiciosStore.error }}
          </div>

          <div class="tabla-panel tabla-panel-full">
            <div class="tabla-header">
              <h3>Lista completa</h3>
              <span>
                {{ tipoServiciosStore.cargando ? 'Cargando...' : `${tipoServiciosStore.tipoServicios.length} registros` }}
              </span>
            </div>

            <div v-if="tipoServiciosStore.cargando" class="loading-state">
              <div class="loader"></div>
              <p>Cargando tipos de servicio...</p>
            </div>

            <div v-else-if="tipoServiciosStore.tipoServicios.length" class="tabla-wrapper">
              <table class="tabla-tipos">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Servicio</th>
                    <th>Precio</th>
                    <th>Tiempo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tipo in tipoServiciosStore.tipoServicios" :key="tipo.id">
                    <td>#{{ tipo.id }}</td>
                    <td class="service-name">{{ tipo.nombre }}</td>
                    <td>{{ obtenerNombreServicio(tipo.servicio_id) }}</td>
                    <td>${{ Number(tipo.precio).toFixed(2) }}</td>
                    <td>{{ tipo.tiempo_estimado }} min</td>
                    <td>
                      <span
                        class="status-badge"
                        :class="tipo.activo ? 'activo' : 'inactivo'"
                      >
                        {{ tipo.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td>
                      <div class="acciones-tabla">
                        <button type="button" class="table-btn edit" @click="editar(tipo)">
                          Editar
                        </button>
                        <button type="button" class="table-btn toggle" @click="toggleEstado(tipo.id)">
                          {{ tipo.activo ? 'Desactivar' : 'Activar' }}
                        </button>
                        <button type="button" class="table-btn danger" @click="eliminar(tipo.id)">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="empty-state">
              <h4>No hay tipos de servicio registrados</h4>
              <p>Haz clic en “Nuevo tipo de servicio” para crear el primero.</p>
            </div>
          </div>
        </section>
      </div>
    </section>

    <transition name="fade">
      <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-card">
          <div class="modal-header">
            <div>
              <h3>{{ seleccionado?.id ? 'Editar tipo de servicio' : 'Nuevo tipo de servicio' }}</h3>
              <p>Completa el formulario para guardar los cambios.</p>
            </div>

            <button type="button" class="close-btn" @click="cerrarModal">
              ✕
            </button>
          </div>

          <TipoServicioForm
            :model-value="seleccionado"
            :servicios="serviciosStore.servicios"
            :cargando="tipoServiciosStore.cargando"
            @submit="guardar"
            @cancel="cerrarModal"
          />
        </div>
      </div>
    </transition>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.tipos-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 22px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
}

.tipos-shell {
  width: min(1680px, 100%);
  animation: pageEnter 0.8s ease;
}

.tipos-layout {
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

.tipos-sidebar {
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

.tipos-sidebar h1 {
  margin: 0 0 16px;
  font-size: 2.3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.tipos-sidebar p {
  margin: 0 0 24px;
  color: #7b6a58;
  line-height: 1.7;
  font-size: 0.95rem;
}

.sidebar-stats {
  display: grid;
  gap: 14px;
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

.tipos-content {
  padding: 24px 28px;
  background: rgba(254, 250, 224, 0.88);
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.back-btn,
.new-btn {
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
}

.back-btn {
  background: rgba(204, 213, 174, 0.55);
  color: #5f4b3a;
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.08);
}

.back-btn:hover {
  transform: translateY(-2px);
  background: rgba(204, 213, 174, 0.78);
  box-shadow: 0 14px 24px rgba(92, 75, 59, 0.12);
}

.new-btn {
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  box-shadow: 0 12px 24px rgba(212, 163, 115, 0.22);
}

.new-btn:hover {
  transform: translateY(-2px);
}

.page-header h2 {
  margin: 0 0 6px;
  font-size: 1.8rem;
  color: #5f4b3a;
}

.page-header p {
  margin: 0;
  color: #8a7764;
  font-size: 0.95rem;
}

.mensaje-exito,
.mensaje-error {
  padding: 14px 18px;
  border-radius: 16px;
  font-weight: 700;
  animation: fadeIn 0.3s ease;
}

.mensaje-exito {
  background: rgba(204, 213, 174, 0.4);
  color: #4f5e33;
  border: 1px solid rgba(107, 130, 69, 0.18);
}

.mensaje-error {
  background: rgba(255, 228, 228, 0.9);
  color: #a14444;
  border: 1px solid rgba(161, 68, 68, 0.14);
}

.tabla-panel-full {
  background: rgba(255, 255, 255, 0.62);
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
  min-height: 640px;
  max-height: 640px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabla-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.tabla-header h3 {
  margin: 0;
  font-size: 1.6rem;
  color: #5f4b3a;
}

.tabla-header span {
  color: #8a7764;
  font-weight: 700;
}

.tabla-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  padding-right: 12px;
  padding-bottom: 8px;
}

.tabla-tipos {
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;
  table-layout: auto;
}

.tabla-tipos th,
.tabla-tipos td {
  text-align: left;
  padding: 13px 10px;
  border-bottom: 1px solid rgba(92, 75, 59, 0.08);
  vertical-align: middle;
  color: #5f4b3a;
  word-wrap: break-word;
}

.tabla-tipos th {
  color: #6c5743;
  font-size: 0.92rem;
  font-weight: 900;
}

.service-name {
  font-weight: 800;
}

.status-badge {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 800;
}

.status-badge.activo {
  background: rgba(204, 213, 174, 0.45);
  color: #536437;
}

.status-badge.inactivo {
  background: rgba(250, 237, 205, 0.95);
  color: #9b6a3b;
}

.acciones-tabla {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  align-items: center;
  min-width: max-content;
}

.table-btn {
  padding: 8px 10px;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  white-space: nowrap;
  font-size: 0.88rem;
}

.table-btn:hover {
  transform: translateY(-2px);
}

.table-btn.edit {
  background: rgba(212, 163, 115, 0.18);
  color: #8d633c;
}

.table-btn.toggle {
  background: rgba(204, 213, 174, 0.44);
  color: #55653a;
}

.table-btn.danger {
  background: rgba(255, 226, 226, 0.95);
  color: #ae4d4d;
}

.loading-state,
.empty-state {
  padding: 34px 18px;
  text-align: center;
}

.loading-state p,
.empty-state p {
  color: #8a7764;
  margin: 12px 0 0;
}

.empty-state h4 {
  margin: 0 0 8px;
  color: #5f4b3a;
  font-size: 1.25rem;
}

.loader {
  width: 42px;
  height: 42px;
  margin: 0 auto;
  border: 4px solid rgba(212, 163, 115, 0.2);
  border-top-color: #d4a373;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
}

.modal-header h3 {
  margin: 0 0 6px;
  font-size: 1.5rem;
  color: #5f4b3a;
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
  font-size: 1.1rem;
  font-weight: 900;
  background: rgba(255, 226, 226, 0.95);
  color: #a14444;
}

.close-btn:hover {
  transform: translateY(-2px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1250px) {
  .tipos-layout {
    grid-template-columns: 1fr;
  }

  .tabla-panel-full {
    max-height: none;
  }
}
</style>