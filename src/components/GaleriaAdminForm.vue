<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useApiGaleria } from '@/composables/useApiGaleria'
import type { Galeria } from '@/types'

const imagenes = ref<Galeria[]>([])
const cargando = ref(false)
const mensaje = ref('')
const error = ref('')

const titulo = ref('')
const imagenArchivo = ref<File | null>(null)

const editando = ref(false)
const idEditando = ref<number | null>(null)

function limpiarFormulario() {
  titulo.value = ''
  imagenArchivo.value = null
  editando.value = false
  idEditando.value = null

  const input = document.getElementById('imagen') as HTMLInputElement | null
  if (input) input.value = ''
}

function seleccionarImagen(event: Event) {
  const target = event.target as HTMLInputElement
  imagenArchivo.value = target.files?.[0] || null
}

function obtenerGaleria() {
  cargando.value = true
  mensaje.value = ''
  error.value = ''

  const { data, onFetchResponse, onFetchError } = useApiGaleria('/galeria')
    .get()
    .json()

  onFetchResponse(() => {
    console.log('Galería obtenida:', data.value)

    if (data.value?.data?.data) {
      imagenes.value = data.value.data.data
    } else if (data.value?.data) {
      imagenes.value = data.value.data
    } else {
      imagenes.value = []
    }

    cargando.value = false
  })

  onFetchError((err) => {
    console.error('Error al obtener galería:', err)
    error.value = 'No se pudieron obtener las imágenes.'
    cargando.value = false
  })
}

function crearImagen() {
  mensaje.value = ''
  error.value = ''

  if (!titulo.value.trim()) {
    error.value = 'El título es obligatorio.'
    return
  }

  if (!imagenArchivo.value) {
    error.value = 'La imagen es obligatoria.'
    return
  }

  const formData = new FormData()
  formData.append('titulo', titulo.value)
  formData.append('imagen', imagenArchivo.value)

  const { data, onFetchResponse, onFetchError } = useApiGaleria('/galeria')
    .post(formData)
    .json()

  onFetchResponse(() => {
    console.log('Imagen creada:', data.value)
    mensaje.value = data.value?.message || 'Imagen subida correctamente.'
    if (props.modoModal) {
        emit('cerrar-modal')
    }
    limpiarFormulario()
    obtenerGaleria()
  })

  onFetchError((err) => {
    console.error('Error al subir imagen:', err)
    error.value = 'No se pudo subir la imagen.'
  })
}

function cargarParaEditar(imagen: Galeria) {
  titulo.value = imagen.titulo
  imagenArchivo.value = null
  idEditando.value = imagen.id || null
  editando.value = true
  mensaje.value = ''
  error.value = ''

  const input = document.getElementById('imagen') as HTMLInputElement | null
  if (input) input.value = ''
}

function actualizarImagen() {
  mensaje.value = ''
  error.value = ''

  if (!idEditando.value) return

  const formData = new FormData()

  if (titulo.value.trim()) {
    formData.append('titulo', titulo.value)
  }

  if (imagenArchivo.value) {
    formData.append('imagen', imagenArchivo.value)
  }

  formData.append('_method', 'PUT')

  const { data, onFetchResponse, onFetchError } = useApiGaleria(`/galeria/${idEditando.value}`)
    .post(formData)
    .json()

  onFetchResponse(() => {
    console.log('Imagen actualizada:', data.value)
    mensaje.value = data.value?.message || 'Imagen actualizada correctamente.'
    if (props.modoModal) {
        emit('cerrar-modal')
    }
    limpiarFormulario()
    obtenerGaleria()
  })

  onFetchError((err) => {
    console.error('Error al actualizar imagen:', err)
    error.value = 'No se pudo actualizar la imagen.'
  })
}

function guardar() {
  if (editando.value) {
    actualizarImagen()
  } else {
    crearImagen()
  }
}

function eliminarImagen(id?: number) {
  if (!id) return

  const confirmar = confirm('¿Seguro que deseas eliminar esta imagen?')
  if (!confirmar) return

  mensaje.value = ''
  error.value = ''

  const { data, onFetchResponse, onFetchError } = useApiGaleria(`/galeria/${id}`)
    .delete()
    .json()

  onFetchResponse(() => {
    console.log('Imagen eliminada:', data.value)
    mensaje.value = data.value?.message || 'Imagen eliminada correctamente.'
    obtenerGaleria()
  })

  onFetchError((err) => {
    console.error('Error al eliminar imagen:', err)
    error.value = 'No se pudo eliminar la imagen.'
  })
}

const props = defineProps<{
  modoModal?: boolean
}>()

const emit = defineEmits<{
  (e: 'cerrar-modal'): void
}>()

onMounted(() => {
  obtenerGaleria()
})
</script>

<template>
  <section class="galeria-form-wrap">
    <div v-if="mensaje" class="mensaje-exito">
      {{ mensaje }}
    </div>

    <div v-if="error" class="mensaje-error">
      {{ error }}
    </div>

    <form class="galeria-form" @submit.prevent="guardar">
      <div class="form-group">
        <label for="titulo">Título</label>
        <input
          id="titulo"
          v-model="titulo"
          type="text"
          placeholder="Título de la imagen"
        />
      </div>

      <div class="form-group">
        <label for="imagen">Imagen</label>
        <input
          id="imagen"
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          @change="seleccionarImagen"
        />
      </div>

      <div class="acciones-formulario">
        <button type="submit" class="btn primary">
          {{ editando ? 'Actualizar imagen' : 'Subir imagen' }}
        </button>

        <button type="button" class="btn secondary" @click="limpiarFormulario">
          Limpiar
        </button>
      </div>
    </form>

    <div v-if="!modoModal">
      <div class="tabla-header">
        <h3>Imágenes registradas</h3>
        <span>{{ cargando ? 'Cargando...' : `${imagenes.length} imágenes` }}</span>
      </div>

      <div v-if="cargando" class="loading-state">
        <div class="loader"></div>
        <p>Cargando galería...</p>
      </div>

      <div v-else class="galeria-grid">
        <article v-for="imagen in imagenes" :key="imagen.id" class="imagen-card">
          <div class="imagen-preview">
            <img
              v-if="imagen.imagen_url"
              :src="imagen.imagen_url"
              :alt="imagen.titulo"
            />
            <span v-else>Sin imagen</span>
          </div>

          <div class="imagen-info">
            <h4>{{ imagen.titulo }}</h4>
            <p>ID #{{ imagen.id }}</p>
          </div>

          <div class="acciones-tabla">
            <button type="button" class="table-btn edit" @click="cargarParaEditar(imagen)">
              Editar
            </button>

            <button type="button" class="table-btn danger" @click="eliminarImagen(imagen.id)">
              Eliminar
            </button>
          </div>
        </article>

        <div v-if="!imagenes.length" class="empty-state">
          <h4>No hay imágenes registradas</h4>
          <p>Haz clic en “Nueva imagen” para subir la primera.</p>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
:global(*) {
  box-sizing: border-box;
}

.galeria-form-wrap {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.galeria-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #5f4b3a;
  font-weight: 800;
  font-size: 0.95rem;
}

input[type="text"],
input[type="file"] {
  width: 100%;
  min-width: 0;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.25);
  background: rgba(255, 255, 255, 0.95);
  color: #5f4b3a;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s ease;
  font-family: inherit;
}

input[type="text"]::placeholder {
  color: #a08c7a;
  font-weight: 500;
}

input[type="text"]:hover,
input[type="file"]:hover {
  border-color: rgba(212, 163, 115, 0.5);
}

input[type="text"]:focus,
input[type="file"]:focus {
  border-color: #D4A373;
  box-shadow:
    0 0 0 4px rgba(212, 163, 115, 0.15),
    0 6px 12px rgba(212, 163, 115, 0.15);
  transform: translateY(-1px);
}

.acciones-formulario {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.95rem;
  transition: all 0.22s ease;
}

.btn.primary {
  padding: 12px 18px;
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.25);
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(212, 163, 115, 0.32);
}

.btn.secondary {
  padding: 12px 18px;
  background: linear-gradient(135deg, #ccd5ae, #b8c493);
  color: #5f4b3a;
  box-shadow: 0 14px 24px rgba(179, 192, 136, 0.22);
}

.btn.secondary:hover {
  transform: translateY(-2px);
}

.mensaje-exito,
.mensaje-error {
  padding: 14px 18px;
  border-radius: 16px;
  font-weight: 700;
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

.tabla-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-top: 8px;
}

.tabla-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #5f4b3a;
}

.tabla-header span {
  color: #8a7764;
  font-weight: 700;
}

.galeria-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
}

.imagen-card {
  background: rgba(255, 255, 255, 0.62);
  border-radius: 24px;
  padding: 16px;
  box-shadow: 0 12px 24px rgba(92, 75, 59, 0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.imagen-preview {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(250, 237, 205, 0.55);
  display: grid;
  place-items: center;
  color: #8a7764;
  font-weight: 700;
}

.imagen-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.imagen-info h4 {
  margin: 0 0 4px;
  color: #5f4b3a;
  font-size: 1rem;
}

.imagen-info p {
  margin: 0;
  color: #8a7764;
  font-size: 0.92rem;
}

.acciones-tabla {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.table-btn {
  padding: 10px 14px;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.22s ease;
}

.table-btn:hover {
  transform: translateY(-2px);
}

.table-btn.edit {
  background: rgba(212, 163, 115, 0.18);
  color: #8d633c;
}

.table-btn.danger {
  background: rgba(255, 226, 226, 0.95);
  color: #ae4d4d;
}

.loading-state,
.empty-state {
  padding: 24px 12px;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>