<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TipoServicioForm from '@/components/TipoServicioForm.vue'
import { useServiciosStore } from '@/stores/servicios'
import { useTipoServiciosStore } from '@/stores/tipoServicios'
import type { TipoServicio } from '@/types'

const serviciosStore = useServiciosStore()
const tipoServiciosStore = useTipoServiciosStore()

const seleccionado = ref<TipoServicio | null>(null)

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
}

function limpiarSeleccion() {
  seleccionado.value = null
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
          <router-link to="/dashboard/admin" class="back-btn">
            ← Volver al dashboard
          </router-link>

          <div class="page-header">
            <div>
              <h2>{{ seleccionado?.id ? 'Editar tipo de servicio' : 'Crear tipo de servicio' }}</h2>
              <p>Completa el formulario para registrar un nuevo tipo de servicio.</p>
            </div>
          </div>

          <div v-if="tipoServiciosStore.mensaje" class="mensaje-exito">
            {{ tipoServiciosStore.mensaje }}
          </div>

          <div v-if="tipoServiciosStore.error" class="mensaje-error">
            {{ tipoServiciosStore.error }}
          </div>

          <div class="content-grid">
            <div class="form-wrap">
              <TipoServicioForm
                :model-value="seleccionado"
                :servicios="serviciosStore.servicios"
                :cargando="tipoServiciosStore.cargando"
                @submit="guardar"
                @cancel="limpiarSeleccion"
              />
            </div>

            <div class="tabla-panel">
              <div class="tabla-header">
                <h3>Tipos registrados</h3>
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
                <p>Crea tu primer tipo de servicio usando el formulario.</p>
              </div>
            </div>
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

.tipos-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
}

.tipos-shell {
  width: min(1720px, 100%);
  animation: pageEnter 0.8s ease;
}

.tipos-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  min-height: 860px;
  border-radius: 34px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.56);
  border: 1px solid rgba(255, 255, 255, 0.52);
  box-shadow: 0 26px 70px rgba(92, 75, 59, 0.16);
  backdrop-filter: blur(16px);
}

.tipos-sidebar {
  padding: 42px 28px;
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
  margin: 0 0 18px;
  font-size: 3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.tipos-sidebar p {
  margin: 0 0 28px;
  color: #7b6a58;
  line-height: 1.9;
  font-size: 1.03rem;
}

.sidebar-stats {
  display: grid;
  gap: 14px;
}

.stat-card {
  padding: 22px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.45);
  box-shadow: 0 10px 24px rgba(92, 75, 59, 0.08);
}

.stat-card strong {
  display: block;
  margin-bottom: 8px;
  font-size: 2rem;
  color: #5f4b3a;
}

.stat-card span {
  color: #7b6a58;
  font-weight: 600;
}

.tipos-content {
  padding: 28px 30px;
  background: rgba(254, 250, 224, 0.88);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.back-btn {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 14px;
  background: rgba(204, 213, 174, 0.55);
  color: #5f4b3a;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.08);
  transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
  background: rgba(204, 213, 174, 0.78);
  box-shadow: 0 14px 24px rgba(92, 75, 59, 0.12);
}

.page-header h2 {
  margin: 0 0 8px;
  font-size: 2rem;
  color: #5f4b3a;
}

.page-header p {
  margin: 0;
  color: #8a7764;
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

.content-grid {
  display: grid;
  grid-template-columns: 430px minmax(980px, 1fr);
  gap: 22px;
  align-items: stretch;
}

.form-wrap {
  min-width: 0;
  height: 100%;
}

.tabla-panel {
  background: rgba(255, 255, 255, 0.62);
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
  min-width: 0;
  min-height: 640px;
  max-height: 640px;
  display: flex;
  flex-direction: column;
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
  overflow-x: hidden;
  padding-right: 6px;
}

.tabla-tipos {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.tabla-tipos th,
.tabla-tipos td {
  text-align: left;
  padding: 14px 10px;
  border-bottom: 1px solid rgba(92, 75, 59, 0.08);
  vertical-align: middle;
  color: #5f4b3a;
  word-wrap: break-word;
}

.tabla-tipos th {
  color: #6c5743;
  font-size: 0.95rem;
  font-weight: 900;
}

.tabla-tipos th:nth-child(1),
.tabla-tipos td:nth-child(1) {
  width: 70px;
}

.tabla-tipos th:nth-child(2),
.tabla-tipos td:nth-child(2) {
  width: 180px;
}

.tabla-tipos th:nth-child(3),
.tabla-tipos td:nth-child(3) {
  width: 150px;
}

.tabla-tipos th:nth-child(4),
.tabla-tipos td:nth-child(4) {
  width: 110px;
}

.tabla-tipos th:nth-child(5),
.tabla-tipos td:nth-child(5) {
  width: 120px;
}

.tabla-tipos th:nth-child(6),
.tabla-tipos td:nth-child(6) {
  width: 120px;
}

.tabla-tipos th:nth-child(7),
.tabla-tipos td:nth-child(7) {
  width: 290px;
}

.service-name {
  font-weight: 800;
}

.status-badge {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.9rem;
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
  flex-wrap: wrap;
  align-items: center;
}

.table-btn {
  padding: 10px 12px;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  white-space: nowrap;
  font-size: 0.95rem;
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

@media (max-width: 1450px) {
  .tipos-shell {
    width: min(100%, 1480px);
  }

  .content-grid {
    grid-template-columns: 430px minmax(760px, 1fr);
  }
}

@media (max-width: 1250px) {
  .tipos-layout {
    grid-template-columns: 1fr;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .tabla-panel {
    max-height: none;
  }
}
</style>