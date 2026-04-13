<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useApiGaleria } from '@/composables/useApiGaleria'
import type { Galeria } from '@/types'

interface CategoriaGaleria {
  id: number
  nombre: string
}

const imagenes = ref<Galeria[]>([])
const categorias = ref<CategoriaGaleria[]>([])

const cargando = ref(false)
const cargandoCategorias = ref(false)

const mensaje = ref('')
const error = ref('')
const mensajeCategoria = ref('')
const errorCategoria = ref('')

const titulo = ref('')
const imagenArchivo = ref<File | null>(null)
const categoriaId = ref('')

const nuevaCategoria = ref('')

const editando = ref(false)
const idEditando = ref<number | null>(null)

const modalCategoriaAbierto = ref(false)

function limpiarFormulario() {
  titulo.value = ''
  imagenArchivo.value = null
  categoriaId.value = ''
  editando.value = false
  idEditando.value = null

  const input = document.getElementById('imagen') as HTMLInputElement | null
  if (input) input.value = ''
}

function limpiarCategoria() {
  nuevaCategoria.value = ''
}

function abrirModalCategoria() {
  mensajeCategoria.value = ''
  errorCategoria.value = ''
  nuevaCategoria.value = ''
  modalCategoriaAbierto.value = true
}

function cerrarModalCategoria() {
  modalCategoriaAbierto.value = false
  limpiarCategoria()
}

function seleccionarImagen(event: Event) {
  const target = event.target as HTMLInputElement
  imagenArchivo.value = target.files?.[0] || null
}

function obtenerCategorias() {
  cargandoCategorias.value = true
  mensajeCategoria.value = ''
  errorCategoria.value = ''

  const { data, onFetchResponse, onFetchError } = useApiGaleria('/categorias-galeria')
    .get()
    .json()

  onFetchResponse(() => {
    if (data.value?.data) {
      categorias.value = data.value.data
    } else {
      categorias.value = []
    }

    cargandoCategorias.value = false
  })

  onFetchError((err) => {
    console.error('Error al obtener categorías:', err)
    errorCategoria.value = 'No se pudieron obtener las categorías.'
    cargandoCategorias.value = false
  })
}

function crearCategoria() {
  mensajeCategoria.value = ''
  errorCategoria.value = ''

  if (!nuevaCategoria.value.trim()) {
    errorCategoria.value = 'El nombre de la categoría es obligatorio.'
    return
  }

  const { data, onFetchResponse, onFetchError } = useApiGaleria('/categorias-galeria')
    .post({
      nombre: nuevaCategoria.value.trim(),
    })
    .json()

  onFetchResponse(() => {
    mensajeCategoria.value = data.value?.message || 'Categoría creada correctamente.'

    const categoriaNueva = data.value?.data
    if (categoriaNueva?.id) {
      categorias.value = [...categorias.value, categoriaNueva].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      )
      categoriaId.value = String(categoriaNueva.id)
    } else {
      obtenerCategorias()
    }

    cerrarModalCategoria()
  })

  onFetchError((err) => {
    console.error('Error al crear categoría:', err)
    errorCategoria.value = data.value?.message || 'No se pudo crear la categoría.'
  })
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

  if (!categoriaId.value) {
    error.value = 'La categoría es obligatoria.'
    return
  }

  if (!imagenArchivo.value) {
    error.value = 'La imagen es obligatoria.'
    return
  }

  const formData = new FormData()
  formData.append('titulo', titulo.value.trim())
  formData.append('categoria_id', categoriaId.value)
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
    error.value = data.value?.message || 'No se pudo subir la imagen.'
  })
}

function cargarParaEditar(imagen: Galeria) {
  titulo.value = imagen.titulo
  imagenArchivo.value = null
  idEditando.value = imagen.id || null
  categoriaId.value = imagen.categoria_id ? String(imagen.categoria_id) : ''
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
    formData.append('titulo', titulo.value.trim())
  }

  if (categoriaId.value) {
    formData.append('categoria_id', categoriaId.value)
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
    error.value = data.value?.message || 'No se pudo actualizar la imagen.'
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
  obtenerCategorias()
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

    <div class="panel-seccion">
      <div class="panel-seccion-header">
        <div>
          <span class="section-badge">Galería</span>
          <h3>{{ editando ? 'Editar imagen' : 'Subir nueva imagen' }}</h3>
          <p>Selecciona o crea una categoría antes de guardar la imagen.</p>
        </div>
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
          <label for="categoria">Categoría</label>

          <div class="categoria-select-row">
            <select id="categoria" v-model="categoriaId">
              <option value="">Selecciona una categoría</option>
              <option
                v-for="categoria in categorias"
                :key="categoria.id"
                :value="String(categoria.id)"
              >
                {{ categoria.nombre }}
              </option>
            </select>

            <button
              type="button"
              class="btn secondary nueva-categoria-btn"
              @click="abrirModalCategoria"
            >
              + Nueva categoría
            </button>
          </div>
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
    </div>

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
            <p v-if="imagen.categoria?.nombre" class="categoria-texto">
              Categoría: {{ imagen.categoria.nombre }}
            </p>
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
          <p>Haz clic en “Subir imagen” para agregar la primera.</p>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="modalCategoriaAbierto"
        class="modal-overlay"
        @click.self="cerrarModalCategoria"
      >
        <div class="modal-card modal-card-small">
          <div class="modal-header">
            <div>
              <h3>Nueva categoría</h3>
              <p>Crea una categoría para organizar las imágenes de la galería.</p>
            </div>

            <button type="button" class="close-btn" @click="cerrarModalCategoria">
              ✕
            </button>
          </div>

          <div v-if="mensajeCategoria" class="mensaje-exito">
            {{ mensajeCategoria }}
          </div>

          <div v-if="errorCategoria" class="mensaje-error">
            {{ errorCategoria }}
          </div>

          <form class="galeria-form" @submit.prevent="crearCategoria">
            <div class="form-group">
              <label for="nuevaCategoriaModal">Nombre de la categoría</label>
              <input
                id="nuevaCategoriaModal"
                v-model="nuevaCategoria"
                type="text"
                placeholder="Ej. Peinados, Tintes, Maquillaje..."
              />
            </div>

            <div class="acciones-formulario">
              <button type="submit" class="btn primary">
                Crear categoría
              </button>

              <button
                type="button"
                class="btn secondary"
                @click="cerrarModalCategoria"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
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

.panel-seccion {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.52);
  border: 1px solid rgba(236, 231, 216, 0.85);
  box-shadow: 0 12px 24px rgba(92, 75, 59, 0.06);
}

.panel-seccion-header h3 {
  margin: 6px 0 6px;
  color: #5f4b3a;
  font-size: 1.2rem;
}

.panel-seccion-header p {
  margin: 0;
  color: #8a7764;
  font-size: 0.94rem;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.16);
  color: #8d633c;
  font-size: 0.82rem;
  font-weight: 800;
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
input[type="file"],
select {
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
input[type="file"]:hover,
select:hover {
  border-color: rgba(212, 163, 115, 0.5);
}

input[type="text"]:focus,
input[type="file"]:focus,
select:focus {
  border-color: #D4A373;
  box-shadow:
    0 0 0 4px rgba(212, 163, 115, 0.15),
    0 6px 12px rgba(212, 163, 115, 0.15);
  transform: translateY(-1px);
}

.categoria-select-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.nueva-categoria-btn {
  white-space: nowrap;
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

.tabla-header h3,
.tabla-header h4 {
  margin: 0;
  font-size: 1.2rem;
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

.categoria-texto {
  margin-top: 6px !important;
  color: #8d633c !important;
  font-weight: 700;
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

.modal-card-small {
  width: min(560px, 100%);
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 700px) {
  .categoria-select-row {
    grid-template-columns: 1fr;
  }

  .nueva-categoria-btn {
    width: 100%;
  }
}
</style>