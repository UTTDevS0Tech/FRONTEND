<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useAdminUserStore} from '../stores/adminUser'
import { useAdminPersonalStore } from '@/stores/adminPersonal'
import AdminUserForm from '@/components/AdminUserForm.vue'
import AdminPersonalForm from '@/components/AdminPersonalForm.vue'


const adminUserStore = useAdminUserStore()
const adminPersonalStore = useAdminPersonalStore()
const modalCrearAbierto = ref(false)
const modalEditarAbierto = ref(false)
const modalSeleccionEditarAbierto = ref(false)
const personalSeleccionado = ref<any | null>(null)
const tipoEdicion = ref<'credenciales' | 'personal' | null>(null)


    const registrosCombinados = computed(() => {
    return adminPersonalStore.personales.map((personal) => {
        const usuario = adminUserStore.usuarios.find(
        (user) => user.id === personal.user_id
        )

        return {
        ...personal,
        user: usuario ?? null,
        }
    })

    })

    
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
}

function cerrarModalCrear() {
  modalCrearAbierto.value = false
}

function abrirSeleccionEdicion(registro: any) {
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
  <main>
    <section>
      <div>
        <h1>Administrar Personal</h1>
        <button @click="abrirModalCrear">
          + Nuevo personal
        </button>
      </div>

      <div v-if="adminPersonalStore.error">
        {{ adminPersonalStore.error }}
      </div>

      <div v-if="adminUserStore.error">
        {{ adminUserStore.error }}
      </div>

      <table>
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
            <td>{{ registro.nombre }}</td>
            <td>{{ registro.descripcion }}</td>
            <td>{{ registro.user?.email ?? 'Sin usuario' }}</td>
            <td>{{ registro.user?.activo ? 'Activo' : 'Inactivo' }}</td>
            <td>
              <button @click="abrirSeleccionEdicion(registro)">
                Editar
              </button>

              <button @click="toggleUsuario(registro.user?.id)">
                {{ registro.user?.activo ? 'Desactivar' : 'Activar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <transition name="fade">
      <div v-if="modalSeleccionEditarAbierto" class="modal-overlay" @click.self="cerrarSeleccionEdicion">
        <div class="modal-card selector-card">
          <h3>¿Qué deseas editar?</h3>
          <p>Elige si quieres modificar las credenciales del usuario o los datos del personal.</p>

          <div class="selector-actions">
            <button type="button" class="table-btn edit" @click="elegirEditarCredenciales">
              Editar credenciales
            </button>

            <button type="button" class="table-btn toggle" @click="elegirEditarPersonal">
              Editar datos del personal
            </button>

            <button type="button" class="table-btn danger" @click="cerrarSeleccionEdicion">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="modalCrearAbierto" class="modal-overlay" @click.self="cerrarModalCrear">
        <div class="modal-card">
          <div class="modal-header">
            <div>
              <h3>Crear nuevo personal</h3>
              <p>Primero crea las credenciales del usuario estilista.</p>
            </div>

            <button type="button" class="close-btn" @click="cerrarModalCrear">
              X
            </button>
          </div>

          <AdminUserForm
            :cargando="adminUserStore.cargando"
            @cancel="cerrarModalCrear"
          />
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="modalEditarAbierto" class="modal-overlay" @click.self="modalEditarAbierto = false">
        <div class="modal-card">
          <div class="modal-header">
            <div>
              <h3>
                {{ tipoEdicion === 'credenciales' ? 'Editar credenciales' : 'Editar datos del personal' }}
              </h3>
              <p>
                {{
                  tipoEdicion === 'credenciales'
                    ? 'Actualiza correo, contraseña o estado del usuario.'
                    : 'Actualiza los datos generales del personal.'
                }}
              </p>
            </div>

            <button type="button" class="close-btn" @click="modalEditarAbierto = false">
              X
            </button>
          </div>

          <AdminUserForm
            v-if="tipoEdicion === 'credenciales'"
            :model-value="personalSeleccionado?.user ?? null"
            :cargando="adminUserStore.cargando"
            @cancel="modalEditarAbierto = false"
          />

          <AdminPersonalForm
            v-else-if="tipoEdicion === 'personal'"
            :model-value="personalSeleccionado"
            :cargando="adminPersonalStore.cargando"
            @cancel="modalEditarAbierto = false"
          />
        </div>
      </div>
    </transition>
  </main>
</template>

<style scoped>
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
  border-radius: 28px;
  background: rgba(254, 250, 224, 0.98);
  box-shadow: 0 28px 60px rgba(92, 75, 59, 0.22);
  padding: 24px;
}

.selector-card h3,
.modal-header h3 {
  margin: 0 0 6px;
  font-size: 1.5rem;
  color: #5f4b3a;
}

.selector-card p,
.modal-header p {
  margin: 0;
  color: #8a7764;
}

.selector-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
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

.table-btn {
  padding: 9px 12px;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
