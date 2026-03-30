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

  const { data, onFetchResponse, onFetchError } = useApiFetchDiego('/servicios')
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

  const { data, onFetchResponse, onFetchError } = useApiFetchDiego(`/servicio/${id}/toggle`)
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
      <div class="servicios-header">
        <h1>Módulo de Servicios</h1>
        <p>Administra los servicios generales de la estética.</p>
      </div>

      <div v-if="mensaje" class="mensaje-exito">
        {{ mensaje }}
      </div>

      <div v-if="error" class="mensaje-error">
        {{ error }}
      </div>

      <div class="servicios-grid">
        <div class="servicios-panel">
          <h2>{{ editando ? 'Editar servicio' : 'Crear servicio' }}</h2>

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
              <label>Activo</label>
              <input
                v-model="formulario.activo"
                type="checkbox"
              />
            </div>

            <div class="acciones-formulario">
              <button type="button" @click="guardarServicio">
                {{ editando ? 'Actualizar' : 'Crear' }}
              </button>

              <button type="button" class="secondary" @click="limpiarFormulario">
                Limpiar
              </button>
            </div>
          </form>
        </div>

        <div class="servicios-panel">
          <h2>Lista de servicios</h2>

          <div v-if="cargando">Cargando servicios...</div>

          <table v-else class="tabla-servicios">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="servicio in servicios" :key="servicio.id">
                <td>{{ servicio.id }}</td>
                <td>{{ servicio.nombre }}</td>
                <td>{{ servicio.activo ? 'Sí' : 'No' }}</td>
                <td class="acciones-tabla">
                  <button type="button" @click="cargarServicioParaEditar(servicio)">
                    Editar
                  </button>

                  <button type="button" @click="toggleServicio(servicio.id)">
                    {{ servicio.activo ? 'Desactivar' : 'Activar' }}
                  </button>

                  <button type="button" class="danger" @click="eliminarServicio(servicio.id)">
                    Eliminar
                  </button>
                </td>
              </tr>

              <tr v-if="!servicios.length">
                <td colspan="4">No hay servicios registrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.servicios-page {
  width: 100%;
  min-height: 100vh;
  padding: 32px;
  background: #f8f6f2;
}

.servicios-shell {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.servicios-header {
  margin-bottom: 24px;
}

.servicios-header h1 {
  margin: 0 0 8px;
  color: #5f4b3a;
}

.servicios-header p {
  margin: 0;
  color: #7b6a58;
}

.servicios-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
}

.servicios-panel {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.servicio-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.check-group {
  flex-direction: row;
  align-items: center;
}

input[type="text"] {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #d8d2c8;
}

.acciones-formulario,
.acciones-tabla {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  padding: 10px 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: #d4a373;
  color: white;
  font-weight: 700;
}

button.secondary {
  background: #a8a29e;
}

button.danger {
  background: #c0392b;
}

.tabla-servicios {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.tabla-servicios th,
.tabla-servicios td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.mensaje-exito {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 12px;
  background: #e8f7e8;
  color: #1f7a1f;
}

.mensaje-error {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 12px;
  background: #fdeaea;
  color: #b42318;
}
</style>