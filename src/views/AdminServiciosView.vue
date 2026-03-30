<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useServiciosStore } from '@/stores/servicios'
import type { Servicio } from '@/types'

const serviciosStore = useServiciosStore()
const { servicios, cargando, error, mensaje } = storeToRefs(serviciosStore)

const formulario = ref<Servicio>({
  nombre: '',
  activo: true,
})

const editando = ref(false)
const servicioEditandoId = ref<number | null>(null)

function limpiarFormulario() {
  formulario.value = {
    nombre: '',
    activo: true,
  }
  editando.value = false
  servicioEditandoId.value = null
  serviciosStore.limpiarMensajes()
}

async function guardarServicio() {
  try {
    if (editando.value && servicioEditandoId.value) {
      await serviciosStore.actualizarServicio(servicioEditandoId.value, {
        nombre: formulario.value.nombre,
        activo: formulario.value.activo,
      })
    } else {
      await serviciosStore.crearServicio({
        nombre: formulario.value.nombre,
        activo: formulario.value.activo,
      })
    }

    limpiarFormulario()
  } catch (err) {
    console.error(err)
  }
}

function cargarServicioParaEditar(servicio: Servicio) {
  formulario.value = {
    nombre: servicio.nombre,
    activo: servicio.activo,
  }

  servicioEditandoId.value = servicio.id || null
  editando.value = true
  serviciosStore.limpiarMensajes()
}

async function borrarServicio(id?: number) {
  if (!id) return

  const confirmar = confirm('¿Seguro que deseas eliminar este servicio?')
  if (!confirmar) return

  try {
    await serviciosStore.eliminarServicio(id)
  } catch (err) {
    console.error(err)
  }
}

async function cambiarEstado(id?: number) {
  if (!id) return

  try {
    await serviciosStore.toggleServicio(id)
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  await serviciosStore.obtenerServicios()
})
</script>

<template>
  <main class="services-page">
    <section class="services-shell">
      <div class="services-layout">
        <aside class="services-sidebar">
          <span class="panel-tag">Administración</span>
          <h1>Gestión de Servicios</h1>
          <p>
            Administra el catálogo general de servicios de la estética.
            Aquí puedes crear, editar, activar o eliminar servicios para que
            luego sean reutilizados por otros módulos del sistema.
          </p>

          <div class="sidebar-stats">
            <div class="stat-card">
              <strong>{{ servicios.length }}</strong>
              <span>Total registrados</span>
            </div>

            <div class="stat-card">
              <strong>{{ servicios.filter(servicio => servicio.activo).length }}</strong>
              <span>Activos</span>
            </div>
          </div>
        </aside>

        <section class="services-content">
          <div class="content-top">
            <div>
              <h2>{{ editando ? 'Editar servicio' : 'Nuevo servicio' }}</h2>
              <p>Completa el formulario para gestionar servicios del sistema.</p>
            </div>
          </div>

          <div v-if="mensaje" class="alert success">
            {{ mensaje }}
          </div>

          <div v-if="error" class="alert error">
            {{ error }}
          </div>

          <form class="service-form" @submit.prevent="guardarServicio">
            <div class="form-group form-group-large">
              <label for="nombre">Nombre del servicio</label>
              <input
                id="nombre"
                v-model="formulario.nombre"
                type="text"
                placeholder="Ej. Cabello, Uñas, Facial..."
                required
              />
            </div>

            <div class="form-group form-group-checkbox">
              <label class="checkbox-wrap">
                <input v-model="formulario.activo" type="checkbox" />
                <span>Servicio activo</span>
              </label>
            </div>

            <div class="form-actions">
              <button class="primary-btn" type="submit">
                {{ editando ? 'Actualizar servicio' : 'Crear servicio' }}
              </button>

              <button class="secondary-btn" type="button" @click="limpiarFormulario">
                Limpiar formulario
              </button>
            </div>
          </form>

          <div class="table-card">
            <div class="table-header">
              <h3>Listado de servicios</h3>
              <span>{{ cargando ? 'Cargando...' : `${servicios.length} servicio(s)` }}</span>
            </div>

            <div v-if="cargando" class="loading-state">
              <div class="loader"></div>
              <p>Cargando servicios...</p>
            </div>

            <div v-else class="table-wrapper">
              <table class="services-table">
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
                        :class="servicio.activo ? 'active' : 'inactive'"
                      >
                        {{ servicio.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td>
                      <div class="actions-inline">
                        <button
                          class="table-btn edit"
                          @click="cargarServicioParaEditar(servicio)"
                        >
                          Editar
                        </button>

                        <button
                          class="table-btn toggle"
                          @click="cambiarEstado(servicio.id)"
                        >
                          {{ servicio.activo ? 'Desactivar' : 'Activar' }}
                        </button>

                        <button
                          class="table-btn delete"
                          @click="borrarServicio(servicio.id)"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!servicios.length">
                    <td colspan="4">
                      <div class="empty-state">
                        <h4>No hay servicios registrados</h4>
                        <p>Crea tu primer servicio usando el formulario de arriba.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<style scoped>
.services-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #FEFAE0 0%, #FAEDCD 55%, #E9EDC9 100%);
}

.services-shell {
  width: min(1440px, 100%);
  animation: pageEnter 0.8s ease;
}

.services-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  min-height: 820px;
  border-radius: 34px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.56);
  border: 1px solid rgba(255, 255, 255, 0.52);
  box-shadow: 0 26px 70px rgba(92, 75, 59, 0.16);
  backdrop-filter: blur(16px);
}

.services-sidebar {
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

.services-sidebar h1 {
  margin: 0 0 18px;
  font-size: 3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.services-sidebar p {
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

.services-content {
  padding: 42px;
  background: rgba(254, 250, 224, 0.88);
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.content-top h2 {
  margin: 0 0 8px;
  font-size: 2.5rem;
  color: #5f4b3a;
}

.content-top p {
  margin: 0;
  color: #8a7764;
  font-size: 1rem;
}

.alert {
  padding: 14px 18px;
  border-radius: 16px;
  font-weight: 700;
  animation: fadeIn 0.3s ease;
}

.alert.success {
  background: rgba(204, 213, 174, 0.4);
  color: #4f5e33;
  border: 1px solid rgba(107, 130, 69, 0.18);
}

.alert.error {
  background: rgba(255, 228, 228, 0.9);
  color: #a14444;
  border: 1px solid rgba(161, 68, 68, 0.14);
}

.service-form {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 20px;
  padding: 28px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.62);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
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

.form-group-large input {
  width: 100%;
  padding: 1rem 1.1rem;
  border-radius: 18px;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: rgba(255, 255, 255, 0.9);
  color: #5f4b3a;
  font-size: 1rem;
  outline: none;
  transition: 0.25s ease;
}

.form-group-large input:focus {
  border-color: #D4A373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
  transform: translateY(-1px);
}

.form-group-checkbox {
  justify-content: end;
  align-items: flex-start;
}

.checkbox-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 100%;
  font-weight: 700;
  color: #5f4b3a;
}

.checkbox-wrap input {
  width: 18px;
  height: 18px;
  accent-color: #D4A373;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn {
  border: none;
  border-radius: 18px;
  padding: 1rem 1.25rem;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
}

.primary-btn {
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.28);
}

.primary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 34px rgba(212, 163, 115, 0.34);
  filter: brightness(1.03);
}

.secondary-btn {
  background: linear-gradient(135deg, #CCD5AE, #b8c493);
  color: #5f4b3a;
  box-shadow: 0 14px 24px rgba(179, 192, 136, 0.22);
}

.secondary-btn:hover {
  transform: translateY(-3px);
}

.table-card {
  padding: 26px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.62);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.table-header h3 {
  margin: 0;
  font-size: 1.7rem;
  color: #5f4b3a;
}

.table-header span {
  color: #8a7764;
  font-weight: 700;
}

.table-wrapper {
  overflow-x: auto;
}

.services-table {
  width: 100%;
  border-collapse: collapse;
}

.services-table th,
.services-table td {
  text-align: left;
  padding: 18px 14px;
  border-bottom: 1px solid rgba(92, 75, 59, 0.08);
  vertical-align: middle;
}

.services-table th {
  color: #6c5743;
  font-size: 0.95rem;
  font-weight: 900;
}

.services-table td {
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

.status-badge.active {
  background: rgba(204, 213, 174, 0.45);
  color: #536437;
}

.status-badge.inactive {
  background: rgba(250, 237, 205, 0.95);
  color: #9b6a3b;
}

.actions-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-btn {
  border: none;
  border-radius: 14px;
  padding: 0.75rem 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
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

.table-btn.delete {
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