<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAdminUserStore } from '../stores/adminUser'
import { useAdminPersonalStore } from '@/stores/adminPersonal'
import { useAdminHorarioStore } from '@/stores/adminHorario'
import AdminUserForm from '@/components/AdminUserForm.vue'
import AdminPersonalForm from '@/components/AdminPersonalForm.vue'
import AdminHorarioForm from '@/components/AdminHorarioForm.vue'
import type { AdminUserPayload, AdminUserUpdatePayload } from '@/types'

type RegistroAdminPersonal = {
  id: number
  nombre: string
  descripcion: string
  user_id: number
  user: {
    id: number
    email: string
    activo: boolean
    rol_id: number
  } | null
}

const adminUserStore = useAdminUserStore()
const adminPersonalStore = useAdminPersonalStore()
const adminHorarioStore = useAdminHorarioStore()

const modalCrearAbierto = ref(false)
const modalEditarAbierto = ref(false)
const modalSeleccionEditarAbierto = ref(false)
const modalHorarioAbierto = ref(false)
const personalSeleccionado = ref<RegistroAdminPersonal | null>(null)
const tipoEdicion = ref<'credenciales' | 'personal' | null>(null)
const usuarioCreadoId = ref<number | null>(null)
const pasoCreacion = ref<'credenciales' | 'personal'>('credenciales')

const registrosCombinados = computed<RegistroAdminPersonal[]>(() =>
  adminPersonalStore.personales.map((personal) => {
    const usuario = adminUserStore.usuarios.find((user) => user.id === personal.user_id)

    return {
      ...personal,
      user: usuario ?? null,
    }
  })
)

const totalActivos = computed(() =>
  registrosCombinados.value.filter((registro) => registro.user?.activo).length
)

const totalInactivos = computed(() =>
  registrosCombinados.value.filter((registro) => registro.user && !registro.user.activo).length
)

const totalSinUsuario = computed(() =>
  registrosCombinados.value.filter((registro) => !registro.user).length
)

const cargandoVista = computed(() => adminPersonalStore.cargando || adminUserStore.cargando)

async function cargarTodo() {
  try {
    await Promise.all([
      adminPersonalStore.obtenerPersonales(),
      adminUserStore.obtenerUsuariosPorRol('Estilista'),
    ])
  } catch (error) {
    console.error('Error al cargar usuarios', error)
  }
}

function abrirModalCrear() {
  modalCrearAbierto.value = true
  pasoCreacion.value = 'credenciales'
  usuarioCreadoId.value = null
}

function cerrarModalCrear() {
  modalCrearAbierto.value = false
  usuarioCreadoId.value = null
  pasoCreacion.value = 'credenciales'
}

function cerrarModalEditar() {
  modalEditarAbierto.value = false
  personalSeleccionado.value = null
  tipoEdicion.value = null
}

async function abrirModalHorario(registro: RegistroAdminPersonal) {
  personalSeleccionado.value = registro
  modalHorarioAbierto.value = true
  adminHorarioStore.limpiarMensajes()
  await adminHorarioStore.obtenerHorarios(registro.id)
}

function cerrarModalHorario() {
  modalHorarioAbierto.value = false
  adminHorarioStore.limpiarMensajes()
}

function abrirSeleccionEdicion(registro: RegistroAdminPersonal) {
  personalSeleccionado.value = registro
  modalSeleccionEditarAbierto.value = true
}

function cerrarSeleccionEdicion() {
  modalSeleccionEditarAbierto.value = false
  tipoEdicion.value = null
}

function elegirEditarCredenciales() {
  tipoEdicion.value = 'credenciales'
  modalSeleccionEditarAbierto.value = false
  modalEditarAbierto.value = true
}

function elegirEditarPersonal() {
  tipoEdicion.value = 'personal'
  modalSeleccionEditarAbierto.value = false
  modalEditarAbierto.value = true
}

async function guardarCredencialesNuevo(payload: AdminUserPayload | AdminUserUpdatePayload) {
  try {
    const usuarioCreado = await adminUserStore.crearUsuario(payload as AdminUserPayload)

    if (!usuarioCreado?.id) {
      throw new Error('No se pudo obtener el ID del usuario')
    }

    usuarioCreadoId.value = usuarioCreado.id
    pasoCreacion.value = 'personal'
  } catch (error) {
    console.error('Error al crear usuario:', error)
  }
}

async function guardarNuevoPersonal(payload: { nombre: string; descripcion: string }) {
  if (!usuarioCreadoId.value) return

  try {
    await adminPersonalStore.crearPersonal({
      ...payload,
      user_id: usuarioCreadoId.value,
    })

    cerrarModalCrear()
    await cargarTodo()
  } catch (error) {
    console.error('Error al crear personal:', error)
  }
}

async function guardarCredencialesEditado(payload: AdminUserPayload | AdminUserUpdatePayload) {
  if (!personalSeleccionado.value?.user?.id) return

  try {
    await adminUserStore.actualizarUsuario(
      personalSeleccionado.value.user.id,
      payload as AdminUserUpdatePayload
    )
    cerrarModalEditar()
    await cargarTodo()
  } catch (error) {
    console.error('Error al actualizar credenciales:', error)
  }
}

async function guardarPersonalEditado(payload: { nombre: string; descripcion: string }) {
  if (!personalSeleccionado.value?.id) return

  try {
    await adminPersonalStore.actualizarPersonal(personalSeleccionado.value.id, {
      ...payload,
      user_id: personalSeleccionado.value.user_id,
    })

    cerrarModalEditar()
    await cargarTodo()
  } catch (error) {
    console.error('Error al actualizar personal:', error)
  }
}

async function guardarHorario(payload: { horarios: any[] }) {
  if (!personalSeleccionado.value?.id) return

  try {
    await adminHorarioStore.guardarHorarios(personalSeleccionado.value.id, payload)
    await adminPersonalStore.obtenerPersonales()
    cerrarModalHorario()
  } catch (error) {
    console.error('Error al guardar horarios:', error)
  }
}

async function toggleUsuario(userId?: number) {
  if (!userId) return

  try {
    await adminUserStore.toggleUsuario(userId)
    await cargarTodo()
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error)
  }
}

onMounted(() => {
  cargarTodo()
})
</script>

<template>
  <main class="personal-page">
    <section class="personal-shell">
      <div class="personal-layout">
        <aside class="personal-sidebar">
          <span class="panel-tag">Administración</span>
          <h1>Personal</h1>
          <p>
            Gestiona estilistas y personal registrado. Desde aquí puedes crear credenciales,
            completar perfiles y activar o desactivar accesos de forma ordenada.
          </p>

          <div class="sidebar-stats">
            <div class="stat-card">
              <strong>{{ registrosCombinados.length }}</strong>
              <span>Registros totales</span>
            </div>

            <div class="stat-card">
              <strong>{{ totalActivos }}</strong>
              <span>Usuarios activos</span>
            </div>

            <div class="stat-card">
              <strong>{{ totalInactivos }}</strong>
              <span>Usuarios inactivos</span>
            </div>

            <div class="stat-card">
              <strong>{{ totalSinUsuario }}</strong>
              <span>Sin credenciales vinculadas</span>
            </div>
          </div>
        </aside>

        <section class="personal-content">
          <div class="top-actions">
            <router-link to="/dashboard/admin" class="back-btn">
              ← Volver al dashboard
            </router-link>

            <button type="button" class="new-btn" @click="abrirModalCrear">
              + Nuevo personal
            </button>
          </div>

          <div class="page-header">
            <div>
              <h2>Personal registrado</h2>
              <p>Consulta, edita y administra la información del equipo de trabajo.</p>
            </div>
          </div>

          <div v-if="adminPersonalStore.error" class="mensaje-error">
            {{ adminPersonalStore.error }}
          </div>

          <div v-if="adminUserStore.error" class="mensaje-error">
            {{ adminUserStore.error }}
          </div>

          <div class="tabla-panel tabla-panel-full">
            <div class="tabla-header">
              <h3>Lista completa</h3>
              <span>
                {{ cargandoVista ? 'Cargando...' : `${registrosCombinados.length} registros` }}
              </span>
            </div>

            <div v-if="cargandoVista" class="loading-state">
              <div class="loader"></div>
              <p>Cargando personal...</p>
            </div>

            <div v-else-if="registrosCombinados.length" class="tabla-wrapper">
              <table class="tabla-personal">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Correo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="registro in registrosCombinados" :key="registro.id">
                    <td>#{{ registro.id }}</td>
                    <td class="personal-name">{{ registro.nombre }}</td>
                    <td class="descripcion-cell">{{ registro.descripcion }}</td>
                    <td>{{ registro.user?.email ?? 'Sin usuario' }}</td>
                    <td>
                      <span
                        class="status-badge"
                        :class="registro.user?.activo ? 'activo' : 'inactivo'"
                      >
                        {{ registro.user?.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td>
                      <div class="acciones-tabla">
                        <button
                          type="button"
                          class="table-btn edit"
                          @click="abrirSeleccionEdicion(registro)"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          class="table-btn schedule"
                          @click="abrirModalHorario(registro)"
                        >
                          Asignar horario
                        </button>

                        <button
                          type="button"
                          class="table-btn toggle"
                          @click="toggleUsuario(registro.user?.id)"
                        >
                          {{ registro.user?.activo ? 'Desactivar' : 'Activar' }}
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="empty-state">
              <h4>No hay personal registrado</h4>
              <p>Haz clic en “Nuevo personal” para crear el primer registro.</p>
            </div>
          </div>
        </section>
      </div>
    </section>

    <transition name="fade">
      <div
        v-if="modalSeleccionEditarAbierto"
        class="modal-overlay"
        @click.self="cerrarSeleccionEdicion"
      >
        <div class="modal-card selector-card">
          <div class="modal-header compact">
            <div>
              <h3>¿Qué deseas editar?</h3>
              <p>
                Elige si quieres modificar las credenciales del usuario o los datos del personal.
              </p>
            </div>

            <button type="button" class="close-btn" @click="cerrarSeleccionEdicion">
              ✕
            </button>
          </div>

          <div class="selector-actions">
            <button type="button" class="table-btn edit selector-btn" @click="elegirEditarCredenciales">
              Editar credenciales
            </button>

            <button type="button" class="table-btn toggle selector-btn" @click="elegirEditarPersonal">
              Editar datos del personal
            </button>

            <button type="button" class="table-btn danger selector-btn" @click="cerrarSeleccionEdicion">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="modalCrearAbierto" class="modal-overlay" @click.self="cerrarModalCrear">
        <div class="modal-card wide-card">
          <div class="modal-header">
            <div>
              <h3 v-if="pasoCreacion === 'credenciales'">Crear credenciales</h3>
              <h3 v-else>Crear datos del personal</h3>

              <p v-if="pasoCreacion === 'credenciales'">
                Ingresa el correo y la contraseña para el nuevo usuario estilista.
              </p>
              <p v-else>
                Ahora captura el nombre y la descripción del nuevo integrante del personal.
              </p>
            </div>

            <button type="button" class="close-btn" @click="cerrarModalCrear">
              ✕
            </button>
          </div>

          <div class="step-badge">
            Paso {{ pasoCreacion === 'credenciales' ? '1 de 2 · Credenciales' : '2 de 2 · Datos del personal' }}
          </div>

          <AdminUserForm
            v-if="pasoCreacion === 'credenciales'"
            :cargando="adminUserStore.cargando"
            @submit="guardarCredencialesNuevo"
            @cancel="cerrarModalCrear"
          />

          <AdminPersonalForm
            v-else
            :cargando="adminPersonalStore.cargando"
            @submit="guardarNuevoPersonal"
            @cancel="cerrarModalCrear"
          />
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="modalHorarioAbierto" class="modal-overlay" @click.self="cerrarModalHorario">
        <div class="modal-card wide-card">
          <div class="modal-header">
            <div>
              <h3>Asignar horario</h3>
              <p>
                Configura la semana laboral de
                <strong>{{ personalSeleccionado?.nombre || 'este estilista' }}</strong>.
              </p>
            </div>

            <button type="button" class="close-btn" @click="cerrarModalHorario">
              âœ•
            </button>
          </div>

          <div v-if="adminHorarioStore.error" class="mensaje-error">
            {{ adminHorarioStore.error }}
          </div>

          <div v-if="adminHorarioStore.mensaje" class="mensaje-exito">
            {{ adminHorarioStore.mensaje }}
          </div>

          <AdminHorarioForm
            :model-value="adminHorarioStore.horarios"
            :cargando="adminHorarioStore.cargando"
            @submit="guardarHorario"
            @cancel="cerrarModalHorario"
          />
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="modalEditarAbierto" class="modal-overlay" @click.self="cerrarModalEditar">
        <div class="modal-card wide-card">
          <div class="modal-header">
            <div>
              <h3>
                {{ tipoEdicion === 'credenciales' ? 'Editar credenciales' : 'Editar datos del personal' }}
              </h3>
              <p>
                {{
                  tipoEdicion === 'credenciales'
                    ? 'Actualiza el correo, la contraseña o el estado del usuario.'
                    : 'Actualiza la información general del personal.'
                }}
              </p>
            </div>

            <button type="button" class="close-btn" @click="cerrarModalEditar">
              ✕
            </button>
          </div>

          <AdminUserForm
            v-if="tipoEdicion === 'credenciales'"
            :model-value="personalSeleccionado?.user ?? null"
            :cargando="adminUserStore.cargando"
            @submit="guardarCredencialesEditado"
            @cancel="cerrarModalEditar"
          />

          <AdminPersonalForm
            v-else-if="tipoEdicion === 'personal'"
            :model-value="personalSeleccionado"
            :cargando="adminPersonalStore.cargando"
            @submit="guardarPersonalEditado"
            @cancel="cerrarModalEditar"
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

.personal-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 22px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
}

.personal-shell {
  width: min(1680px, 100%);
  animation: pageEnter 0.8s ease;
}

.personal-layout {
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

.personal-sidebar {
  padding: 34px 24px;
  background: linear-gradient(180deg, #ccd5ae 0%, #e9edc9 100%);
  display: flex;
  flex-direction: column;
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

.personal-sidebar h1 {
  margin: 0 0 16px;
  font-size: 2.3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.personal-sidebar p {
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

.personal-content {
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
  background: linear-gradient(135deg, #d4a373, #bf8c5a);
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

.mensaje-error {
  padding: 14px 18px;
  border-radius: 16px;
  font-weight: 700;
  animation: fadeIn 0.3s ease;
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

.tabla-personal {
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;
  table-layout: auto;
}

.tabla-personal th,
.tabla-personal td {
  text-align: left;
  padding: 13px 10px;
  border-bottom: 1px solid rgba(92, 75, 59, 0.08);
  vertical-align: middle;
  color: #5f4b3a;
}

.tabla-personal th {
  color: #6c5743;
  font-size: 0.92rem;
  font-weight: 900;
}

.personal-name {
  font-weight: 800;
}

.descripcion-cell {
  max-width: 280px;
  line-height: 1.6;
  color: #7b6a58;
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
  padding: 9px 12px;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.table-btn:hover {
  transform: translateY(-1px);
}

.table-btn.edit {
  background: rgba(212, 163, 115, 0.18);
  color: #8d633c;
}

.table-btn.toggle {
  background: rgba(204, 213, 174, 0.44);
  color: #55653a;
}

.table-btn.schedule {
  background: rgba(220, 232, 250, 0.9);
  color: #355886;
}

.table-btn.danger {
  background: rgba(255, 226, 226, 0.95);
  color: #ae4d4d;
}

.mensaje-exito {
  padding: 14px 18px;
  margin-bottom: 14px;
  border-radius: 16px;
  font-weight: 700;
  animation: fadeIn 0.3s ease;
  background: rgba(204, 213, 174, 0.38);
  color: #436132;
  border: 1px solid rgba(92, 75, 59, 0.08);
}

.loading-state,
.empty-state {
  flex: 1;
  display: grid;
  place-items: center;
  text-align: center;
  color: #7b6a58;
}

.loading-state p,
.empty-state p {
  margin: 8px 0 0;
}

.empty-state h4 {
  margin: 0;
  font-size: 1.2rem;
  color: #5f4b3a;
}

.loader {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 4px solid rgba(212, 163, 115, 0.22);
  border-top-color: #d4a373;
  animation: spin 0.85s linear infinite;
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
  width: min(620px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 28px;
  background: rgba(254, 250, 224, 0.98);
  box-shadow: 0 28px 60px rgba(92, 75, 59, 0.22);
  padding: 24px;
}

.wide-card {
  width: min(760px, 100%);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
}

.modal-header.compact {
  margin-bottom: 8px;
}

.modal-header h3 {
  margin: 0 0 6px;
  font-size: 1.5rem;
  color: #5f4b3a;
}

.modal-header p {
  margin: 0;
  color: #8a7764;
  line-height: 1.6;
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

.step-badge {
  display: inline-flex;
  width: fit-content;
  margin-bottom: 18px;
  padding: 9px 14px;
  border-radius: 999px;
  background: rgba(204, 213, 174, 0.38);
  color: #5f4b3a;
  font-size: 0.88rem;
  font-weight: 900;
}

.selector-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.selector-btn {
  min-width: 180px;
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
    transform: translateY(16px);
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1180px) {
  .personal-layout {
    grid-template-columns: 1fr;
  }

  .personal-sidebar {
    border-bottom: 1px solid rgba(95, 75, 58, 0.08);
  }

  .sidebar-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .personal-page {
    padding: 12px;
  }

  .personal-content,
  .personal-sidebar,
  .tabla-panel-full,
  .modal-card {
    padding: 18px;
  }

  .sidebar-stats {
    grid-template-columns: 1fr;
  }

  .tabla-panel-full {
    min-height: 560px;
    max-height: none;
  }

  .selector-actions,
  .acciones-tabla {
    flex-wrap: wrap;
  }

  .selector-btn {
    width: 100%;
  }
}
</style>
