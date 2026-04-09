<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useAdminUserStore} from '../stores/adminUser'
import { useAdminPersonalStore } from '@/stores/adminPersonal'


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
  </main>
</template>

<style scoped>
</style>