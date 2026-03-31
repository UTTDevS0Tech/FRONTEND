<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFetch } from '@vueuse/core'
import { useApiFetchDiego } from '@/composables/useApi'
import type { Servicio } from '@/types'

const servicios = ref<Servicio[]>([])
const cargando = ref(false)
const mensaje = ref('')
const error = ref('')

const formulario = ref<Servicio>({
  nombre: '',
  activo: true
})

const editando = ref(false)
const idEditando = ref<number | null>(null)

function limpiarFormulario() {
  formulario.value = {
    nombre: '',
    activo: true
  }
  editando.value = false
  idEditando.value = null
}

function obtenerServicios() {
  cargando.value = true
  error.value = ''
  mensaje.value = ''

  const { data, onFetchResponse, onFetchError } = useFetch('https://api.carlosd-dev.me/api/servicios')
    .get()
    .json()

  onFetchResponse(() => {
    console.log('Servicios obtenidos:', data.value)

    if (data.value) {
      servicios.value = data.value.data
      mensaje.value = data.value.message || ''
    }

    cargando.value = false
  })

  onFetchError((err) => {
    console.error('Error al obtener servicios:', err)
    error.value = 'No se pudieron obtener los servicios.'
    cargando.value = false
  })
}

function guardarServicio() {
  error.value = ''
  mensaje.value = ''

  if (editando.value && idEditando.value) {
    actualizarServicio(idEditando.value)
    return
  }

  const { data, onFetchResponse, onFetchError } = useApiFetchDiego('/servicios')
    .post(formulario.value)
    .json()

  onFetchResponse(() => {
    console.log('Servicio creado:', data.value)

    mensaje.value = data.value?.message || 'Servicio creado correctamente.'
    limpiarFormulario()
    obtenerServicios()
  })

  onFetchError((err) => {
    console.error('Error al crear servicio:', err)
    error.value = 'No se pudo crear el servicio.'
  })
}

function cargarServicioParaEditar(servicio: Servicio) {
  formulario.value = {
    nombre: servicio.nombre,
    activo: servicio.activo
  }

  idEditando.value = servicio.id || null
  editando.value = true
  mensaje.value = ''
  error.value = ''
}

function actualizarServicio(id: number) {
  error.value = ''
  mensaje.value = ''

  const { data, onFetchResponse, onFetchError } = useApiFetchDiego(`/servicios/${id}`)
    .put(formulario.value)
    .json()

  onFetchResponse(() => {
    console.log('Servicio actualizado:', data.value)

    mensaje.value = data.value?.message || 'Servicio actualizado correctamente.'
    limpiarFormulario()
    obtenerServicios()
  })

  onFetchError((err) => {
    console.error('Error al actualizar servicio:', err)
    error.value = 'No se pudo actualizar el servicio.'
  })
}

function eliminarServicio(id?: number) {
  if (!id) return

  const confirmar = confirm('¿Seguro que deseas eliminar este servicio?')
  if (!confirmar) return

  error.value = ''
  mensaje.value = ''

  const { data, onFetchResponse, onFetchError } = useApiFetchDiego(`/servicios/${id}`)
    .delete()
    .json()

  onFetchResponse(() => {
    console.log('Servicio eliminado:', data.value)

    mensaje.value = data.value?.message || 'Servicio eliminado correctamente.'
    obtenerServicios()
  })

  onFetchError((err) => {
    console.error('Error al eliminar servicio:', err)
    error.value = 'No se pudo eliminar el servicio.'
  })
}

function toggleServicio(id?: number) {
  if (!id) return

  error.value = ''
  mensaje.value = ''

  const { data, onFetchResponse, onFetchError } = useApiFetchDiego(`/servicios/${id}/toggle`)
    .patch({})
    .json()

  onFetchResponse(() => {
    console.log('Estado actualizado:', data.value)

    mensaje.value = data.value?.message || 'Estado del servicio actualizado correctamente.'
    obtenerServicios()
  })

  onFetchError((err) => {
    console.error('Error al cambiar estado:', err)
    error.value = 'No se pudo cambiar el estado del servicio.'
  })
}

onMounted(() => {
  obtenerServicios()
})
</script>

<template>
  <main class="servicios-page">
    <section class="servicios-shell">
      <div class="servicios-layout">
        <aside class="servicios-sidebar">
          <span class="panel-tag">Administración</span>
          <h1>Servicios</h1>
          <p>
            Administra los servicios de la estética.
          </p>

          <div class="sidebar-stats">
            <div class="stat-card">
              <strong>{{ servicios.length }}</strong>
              <span>Total de servicios</span>
            </div>

            <div class="stat-card">
              <strong>{{ servicios.filter(servicio => servicio.activo).length }}</strong>
              <span>Servicios activos</span>
            </div>
          </div>
        </aside>

        <section class="servicios-content">
          <router-link to="/dashboard/admin" class="back-btn"> 
            ← Volver al dashboard
          </router-link>
          <div class="servicios-header">
            <div>
              <h2>{{ editando ? 'Editar servicio' : 'Crear servicio' }}</h2>
              <p>Gestiona aquí el catálogo general de la estética.</p>
            </div>
          </div>

          <div v-if="mensaje" class="mensaje-exito">
            {{ mensaje }}
          </div>

          <div v-if="error" class="mensaje-error">
            {{ error }}
          </div>

          <div class="servicios-grid">
            <div class="servicios-panel formulario-panel">
              <h3>{{ editando ? 'Formulario de edición' : 'Nuevo servicio' }}</h3>

              <form class="servicio-form">
                <div class="form-group">
                  <label>Nombre del servicio</label>
                  <input
                    v-model="formulario.nombre"
                    type="text"
                    placeholder="Ej. Cabello"
                  />
                </div>

                <div class="form-group check-group">
                  <label class="checkbox-wrap">
                    <input
                      v-model="formulario.activo"
                      type="checkbox"
                    />
                    <span>Servicio activo</span>
                  </label>
                </div>

                <div class="acciones-formulario">
                  <button type="button" @click="guardarServicio">
                    {{ editando ? 'Actualizar servicio' : 'Crear servicio' }}
                  </button>

                  <button type="button" class="secondary" @click="limpiarFormulario">
                    Limpiar
                  </button>
                </div>
              </form>
            </div>

            <div class="servicios-panel tabla-panel">
              <div class="tabla-header">
                <h3>Lista de servicios</h3>
                <span>{{ cargando ? 'Cargando...' : `${servicios.length} registrados` }}</span>
              </div>

              <div v-if="cargando" class="loading-state">
                <div class="loader"></div>
                <p>Cargando servicios...</p>
              </div>

              <div v-else class="tabla-wrapper">
                <table class="tabla-servicios">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="servicio in servicios" :key="servicio.id">
                      <td>#{{ servicio.id }}</td>
                      <td class="service-name">{{ servicio.nombre }}</td>
                      <td>
                        <span
                          class="status-badge"
                          :class="servicio.activo ? 'activo' : 'inactivo'"
                        >
                          {{ servicio.activo ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td class="acciones-tabla">
                        <button type="button" class="table-btn edit" @click="cargarServicioParaEditar(servicio)">
                          Editar
                        </button>

                        <button type="button" class="table-btn toggle" @click="toggleServicio(servicio.id)">
                          {{ servicio.activo ? 'Desactivar' : 'Activar' }}
                        </button>

                        <button type="button" class="table-btn danger" @click="eliminarServicio(servicio.id)">
                          Eliminar
                        </button>
                      </td>
                    </tr>

                    <tr v-if="!servicios.length">
                      <td colspan="4">
                        <div class="empty-state">
                          <h4>No hay servicios registrados</h4>
                          <p>Crea tu primer servicio usando el formulario.</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
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

.servicios-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #FEFAE0 0%, #FAEDCD 58%, #E9EDC9 100%);
}

.servicios-shell {
  width: min(1440px, 100%);
  animation: pageEnter 0.8s ease;
}

.servicios-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  min-height: 840px;
  border-radius: 34px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.56);
  border: 1px solid rgba(255, 255, 255, 0.52);
  box-shadow: 0 26px 70px rgba(92, 75, 59, 0.16);
  backdrop-filter: blur(16px);
}

.servicios-sidebar {
  padding: 50px 36px;
  background: linear-gradient(180deg, #CCD5AE 0%, #E9EDC9 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
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

.servicios-sidebar h1 {
  margin: 0 0 18px;
  font-size: 3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.servicios-sidebar p {
  margin: 0 0 28px;
  color: #7b6a58;
  line-height: 1.9;
  font-size: 1.03rem;
  max-width: 290px;
}

.sidebar-stats {
  display: grid;
  gap: 16px;
}

.stat-card {
  padding: 20px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.48);
  box-shadow: 0 10px 24px rgba(92, 75, 59, 0.08);
  transition: transform 0.25s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card strong {
  display: block;
  margin-bottom: 6px;
  font-size: 2rem;
  color: #5f4b3a;
}

.stat-card span {
  color: #7b6a58;
  font-weight: 600;
}

.servicios-content {
  padding: 42px;
  background: rgba(254, 250, 224, 0.88);
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.servicios-header h2 {
  margin: 0 0 8px;
  font-size: 2.5rem;
  color: #5f4b3a;
}

.servicios-header p {
  margin: 0;
  color: #8a7764;
  font-size: 1rem;
}

.mensaje-exito,
.mensaje-error {
  margin-bottom: 4px;
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

.servicios-grid {
  display: grid;
  grid-template-columns: 390px 1fr;
  gap: 22px;
}

.servicios-panel {
  background: rgba(255, 255, 255, 0.62);
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
}

.servicios-panel h3 {
  margin: 0 0 18px;
  font-size: 1.6rem;
  color: #5f4b3a;
}

.servicio-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  color: #5f4b3a;
  font-weight: 800;
}

input[type="text"] {
  padding: 14px 15px;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: rgba(255, 255, 255, 0.92);
  color: #5f4b3a;
  font-size: 1rem;
  outline: none;
  transition: 0.25s ease;
}

input[type="text"]:focus {
  border-color: #D4A373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
  transform: translateY(-1px);
}

.check-group {
  flex-direction: row;
  align-items: center;
}

.checkbox-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #5f4b3a;
}

.checkbox-wrap input {
  width: 18px;
  height: 18px;
  accent-color: #D4A373;
}

.acciones-formulario,
.acciones-tabla {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  padding: 12px 16px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 800;
  transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
}

button:hover {
  transform: translateY(-2px);
}

.acciones-formulario button {
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.25);
}

.acciones-formulario button.secondary {
  background: linear-gradient(135deg, #CCD5AE, #b8c493);
  color: #5f4b3a;
  box-shadow: 0 14px 24px rgba(179, 192, 136, 0.22);
}

.tabla-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.tabla-header span {
  color: #8a7764;
  font-weight: 700;
}

.tabla-wrapper {
  overflow-x: auto;
}

.tabla-servicios {
  width: 100%;
  border-collapse: collapse;
}

.tabla-servicios th,
.tabla-servicios td {
  text-align: left;
  padding: 16px 12px;
  border-bottom: 1px solid rgba(92, 75, 59, 0.08);
  vertical-align: middle;
}

.tabla-servicios th {
  color: #6c5743;
  font-size: 0.95rem;
  font-weight: 900;
}

.tabla-servicios td {
  color: #5f4b3a;
  font-weight: 600;
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

.table-btn {
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: none;
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
  border-top-color: #D4A373;
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
</style>