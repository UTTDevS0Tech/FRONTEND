<script setup lang="ts">
import { useApiGaleria } from '@/composables/useApiGaleria'
import { onMounted, onUnmounted, ref } from 'vue'


//tipo de imagen (lo que viene del backend)
interface ImagenGaleria {
  id: number
  titulo: string
  imagen: string
  imagen_url: string | null
  categoria_id: number | null
  created_at?: string
  updated_at?: string
}


//tipo de categoría con sus imágenes
interface CategoriaGaleria {
  id: number
  nombre: string
  imagenes: ImagenGaleria[]
}


//aquí guarda todas las categorías con sus imágenes
const categorias = ref<CategoriaGaleria[]>([])

//estado de carga
const cargando = ref(false)

//mensaje de error
const error = ref('')


//trae la galería pública (lo que vería cliente)
function obtenerGaleriaPublica() {
  cargando.value = true
  error.value = ''

  const { data, onFetchResponse, onFetchError } = useApiGaleria('/galeria/publica')
    .get()
    .json()

  onFetchResponse(() => {
    //guardamos categorías (cada una ya trae sus imágenes)
    categorias.value = data.value?.data || []

    cargando.value = false
  })

  onFetchError((err) => {
    console.error('Error al obtener galería pública:', err)
    error.value = 'No se pudo cargar la galería.'
    cargando.value = false
  })
}


//obj q guarda referencias a los contenedores de scroll
//ej{1: div, 2: div, 3: div}
const categoriaRows = ref<Record<number, HTMLDivElement | null>>({})


//esto guarda la referencia de cada fila de categoría
function setCategoriaRef(id: number, el: HTMLDivElement | null) {
  categoriaRows.value[id] = el
}


//esto mueve el scroll horizontal de la cat
function scrollCategoria(id: number, direccion: 'left' | 'right') {
  const contenedor = categoriaRows.value[id]

  if (!contenedor) return
  const distancia = 260

  contenedor.scrollBy({
    left: direccion === 'right' ? distancia : -distancia,
    behavior: 'smooth',
  })
}


//esto guarda la imagen selec
const imagenSeleccionada = ref<ImagenGaleria | null>(null)


//abre la imagen bn aca ya pro full resolution
function abrirImagen(imagen: ImagenGaleria) {
  imagenSeleccionada.value = imagen
}

function cerrarImagen() {
  imagenSeleccionada.value = null
}


//esto anda al tiro de las teclas del teclado
function manejarTecla(event: KeyboardEvent) {
  //si el usuario presiona ESC se chingo
  if (event.key === 'Escape') {
    cerrarImagen()
  }
}


//cuando carga el componente
onMounted(() => {
  obtenerGaleriaPublica()
  window.addEventListener('keydown', manejarTecla)
})


//cuando se destruye el comp
onUnmounted(() => {
  // quita el event para no romper todo
  window.removeEventListener('keydown', manejarTecla)
})
</script>

<template>
  <main class="galeria-page">
    <section class="galeria-shell">
      <div class="galeria-layout">
        <aside class="galeria-sidebar">
          <span class="panel-tag">Cliente</span>
          <h1>Galería</h1>
          <p>
            Explora algunos de nuestros trabajos más recientes organizados por categoría.
            Inspírate y conoce un poco más de lo que podemos hacer por ti.
          </p>
        </aside>

        <section class="galeria-content">
          <div class="top-actions">
            <router-link to="/dashboard/cliente" class="back-btn">
              ← Volver a la página principal
            </router-link>
          </div>

          <div v-if="cargando" class="empty-state">
            <div class="loader"></div>
            <p>Cargando galería...</p>
          </div>

          <div v-else-if="error" class="empty-state error-state">
            <h3>No se pudo cargar la galería</h3>
            <p>{{ error }}</p>
          </div>

          <div v-else-if="!categorias.length" class="empty-state">
            <h3>Aún no hay categorías disponibles</h3>
            <p>Pronto podrás ver aquí nuestros trabajos más recientes.</p>
          </div>

          <div v-else class="categorias-stack">
            <section
              v-for="categoria in categorias"
              :key="categoria.id"
              class="categoria-card"
            >
              <div class="categoria-header">
                <div>
                  <h3>{{ categoria.nombre }}</h3>
                  <p>
                    {{ categoria.imagenes.length }}
                    {{ categoria.imagenes.length === 1 ? 'imagen' : 'imágenes' }}
                  </p>
                </div>
              </div>
              <div v-if="categoria.imagenes.length" class="galeria-carousel">
                <button
                    type="button"
                    class="carousel-btn"
                    @click="scrollCategoria(categoria.id, 'left')"
                >
                    ‹
                </button>

                <div
                    class="galeria-row"
                    :ref="(el) => setCategoriaRef(categoria.id, el as HTMLDivElement | null)"
                >
                    <article
                    v-for="imagen in categoria.imagenes"
                    :key="imagen.id"
                    class="imagen-card"
                    @click="abrirImagen(imagen)"
                    >
                    <div class="imagen-frame">
                        <img
                        v-if="imagen.imagen_url"
                        :src="imagen.imagen_url"
                        :alt="imagen.titulo"
                        />
                        <div v-else class="sin-imagen">Sin imagen</div>
                    </div>
                    </article>
                </div>

                <button
                    type="button"
                    class="carousel-btn"
                    @click="scrollCategoria(categoria.id, 'right')"
                >
                    ›
                </button>
             </div>
            </section>
          </div>
        </section>
      </div>
    </section>
    <div
        v-if="imagenSeleccionada"
        class="image-modal-overlay"
        @click="cerrarImagen"
        >
        <div class="image-modal-card" @click.stop>
            <button
            type="button"
            class="image-modal-close"
            @click="cerrarImagen"
            >
            ✕
            </button>

            <img
            v-if="imagenSeleccionada.imagen_url"
            :src="imagenSeleccionada.imagen_url"
            :alt="imagenSeleccionada.titulo"
            class="image-modal-img"
            />

            <div class="image-modal-info">
            <h4>{{ imagenSeleccionada.titulo }}</h4>
            </div>
        </div>
    </div>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.galeria-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 22px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
  color: #5f4b3a;
}

.galeria-shell {
  width: min(1680px, 100%);
  animation: pageEnter 0.8s ease;
}

.galeria-layout {
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

.galeria-sidebar {
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

.galeria-sidebar h1 {
  margin: 0 0 16px;
  font-size: 2.3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.galeria-sidebar p {
  margin: 0 0 24px;
  color: #7b6a58;
  line-height: 1.7;
  font-size: 0.95rem;
}

.sidebar-stats {
  display: grid;
  gap: 18px;
  margin-top: 12px;
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

.galeria-content {
  padding: 24px 28px;
  background: rgba(254, 250, 224, 0.88);
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.top-actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.back-btn {
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
  background: rgba(204, 213, 174, 0.55);
  color: #5f4b3a;
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.08);
}

.back-btn:hover {
  transform: translateY(-2px);
  background: rgba(204, 213, 174, 0.78);
  box-shadow: 0 14px 24px rgba(92, 75, 59, 0.12);
}

.page-header {
  display: grid;
  gap: 0.35rem;
}

.page-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #5f4b3a;
}

.page-header p {
  margin: 0;
  color: #8a7764;
  font-size: 0.95rem;
}

.categorias-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.categoria-card,
.empty-state {
  background: rgba(255, 255, 255, 0.62);
  border-radius: 28px;
  border: 1px solid rgba(236, 231, 216, 0.7);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
}

.categoria-card {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.categoria-header h3 {
  margin: 0 0 6px;
  color: #5f4b3a;
  font-size: 1.4rem;
}

.categoria-header p {
  margin: 0;
  color: #8a7764;
  font-weight: 700;
}

.galeria-carousel {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
}

.galeria-row {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  padding: 4px 2px 10px;
}

.galeria-row::-webkit-scrollbar {
  display: none;
}

.imagen-card {
  flex: 0 0 180px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.imagen-frame {
  width: 100%;
  aspect-ratio: 1 / 1;
  max-height: 190px;
  border-radius: 22px;
  overflow: hidden;
  background: rgba(250, 237, 205, 0.8);
  box-shadow: 0 12px 24px rgba(92, 75, 59, 0.08);
}

.carousel-btn {
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 50%;
  background: rgba(212, 163, 115, 0.18);
  color: #8d633c;
  font-size: 1.8rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.08);
  transition: transform 0.22s ease, background 0.22s ease;
}

.carousel-btn:hover {
  transform: translateY(-2px);
  background: rgba(212, 163, 115, 0.28);
}

.imagen-frame {
  width: 100%;
  aspect-ratio: 1 / 1;
  max-height: 200px;
  border-radius: 22px;
  overflow: hidden;
  background: rgba(250, 237, 205, 0.8);
  box-shadow: 0 12px 24px rgba(92, 75, 59, 0.08);
}

.imagen-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.imagen-card:hover .imagen-frame img {
  transform: scale(1.03);
}

.imagen-info h4 {
  margin: 0;
  color: #5f4b3a;
  font-size: 1rem;
}

.sin-imagen {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #8a7764;
  font-weight: 700;
}

.empty-state {
  padding: 36px 18px;
  text-align: center;
}

.empty-state h3 {
  color: #5f4b3a;
  margin: 0 0 8px;
}

.empty-state p,
.empty-category p {
  color: #8a7764;
  margin: 0;
}

.error-state {
  background: rgba(255, 244, 244, 0.9);
}

.empty-category {
  padding: 8px 4px 2px;
}

.loader {
  width: 42px;
  height: 42px;
  margin: 0 auto 12px;
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

@media (max-width: 1250px) {
  .galeria-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .galeria-page {
    padding: 16px;
  }

  .galeria-content {
    padding: 18px;
  }

  .categoria-card,
  .empty-state {
    padding: 18px;
    border-radius: 22px;
  }

  .page-header h2 {
    font-size: 1.5rem;
  }
}

.imagen-card {
  cursor: pointer;
}

.image-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(45, 34, 24, 0.7);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 300;
}

.image-modal-card {
  position: relative;
  width: min(92vw, 900px);
  max-height: 90vh;
  padding: 18px 18px 14px;
  border-radius: 28px;
  background: rgba(255, 250, 240, 0.98);
  box-shadow: 0 28px 60px rgba(45, 34, 24, 0.3);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-modal-img {
  width: 100%;
  max-height: 72vh;
  object-fit: contain;
  border-radius: 20px;
  background: rgba(250, 237, 205, 0.55);
}

.image-modal-info h4 {
  margin: 0;
  color: #5f4b3a;
  font-size: 1rem;
}

.image-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 900;
  background: rgba(255, 226, 226, 0.96);
  color: #a14444;
  box-shadow: 0 10px 18px rgba(161, 68, 68, 0.12);
  transition: transform 0.22s ease, background 0.22s ease;
}

.image-modal-close:hover {
  transform: translateY(-2px);
  background: rgba(255, 214, 214, 1);
}
</style>