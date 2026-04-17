<script setup lang="ts">
import { useApiGaleria } from '@/composables/useApiGaleria'
import { onMounted, onUnmounted, ref, computed } from 'vue'


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

const totalImagenes = computed(() =>
  categorias.value.reduce((acc, categoria) => acc + categoria.imagenes.length, 0)
)


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
    <div class="page-gradient"></div>
    <div class="page-pattern"></div>
    <div class="page-glow glow-1"></div>
    <div class="page-glow glow-2"></div>

    <section class="hero-strip">
      <div class="hero-copy">
        <span class="panel-tag">Cliente</span>
        <h1>Galería</h1>
        <p>
          Explora algunos de nuestros trabajos más recientes organizados por categoría.
          Inspírate y conoce un poco más de lo que podemos hacer por ti.
        </p>
      </div>

      <div class="hero-stats">
        <article class="stat-card">
          <strong>{{ categorias.length }}</strong>
          <span>Categorías activas</span>
        </article>

        <article class="stat-card">
          <strong>{{ totalImagenes }}</strong>
          <span>Imágenes disponibles</span>
        </article>
      </div>
    </section>

    <section class="content-area">
      <div class="top-actions">
        <router-link to="/dashboard/cliente" class="back-btn">
          ← Volver a la página principal
        </router-link>
      </div>

      <div class="page-header">
        <h2>Nuestros trabajos</h2>
        <p>
          Recorre cada categoría y abre las imágenes para verlas con más detalle.
        </p>
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
          <div class="card-glow"></div>

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

                <div class="imagen-info">
                  <h4>{{ imagen.titulo }}</h4>
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

          <div v-else class="empty-category">
            <p>No hay imágenes disponibles en esta categoría por el momento.</p>
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

    <div class="image-modal-media-wrap">
      <img
        v-if="imagenSeleccionada.imagen_url"
        :src="imagenSeleccionada.imagen_url"
        :alt="imagenSeleccionada.titulo"
        class="image-modal-img"
      />
    </div>

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
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(204, 213, 174, 0.95), transparent 22%),
    radial-gradient(circle at 85% 20%, rgba(233, 237, 201, 0.72), transparent 20%),
    radial-gradient(circle at bottom right, rgba(212, 163, 115, 0.18), transparent 22%),
    linear-gradient(145deg, #fefae0 0%, #f7f1de 42%, #e9edc9 100%);
  color: #5f4b3a;
}

.page-gradient {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0));
  pointer-events: none;
}

.page-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.16) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.18), transparent 60%);
  pointer-events: none;
}

.page-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(46px);
  pointer-events: none;
}

.glow-1 {
  top: 80px;
  left: -100px;
  width: 260px;
  height: 260px;
  background: rgba(212, 163, 115, 0.12);
}

.glow-2 {
  right: -120px;
  bottom: 120px;
  width: 320px;
  height: 320px;
  background: rgba(204, 213, 174, 0.32);
}

.hero-strip {
  position: relative;
  z-index: 1;
  width: min(1440px, calc(100% - 48px));
  margin: 0 auto;
  padding: 48px 0 22px;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  gap: 22px;
  animation: pageEnter 0.8s ease;
}

.hero-copy {
  padding: 18px 0;
}

.panel-tag {
  display: inline-block;
  width: fit-content;
  margin-bottom: 18px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.38);
  color: #6d5844;
  font-weight: 800;
  font-size: 0.95rem;
  backdrop-filter: blur(8px);
}

.hero-copy h1 {
  margin: 0 0 16px;
  font-size: clamp(2.6rem, 5vw, 4.2rem);
  line-height: 0.98;
  color: #5f4b3a;
}

.hero-copy p {
  margin: 0;
  max-width: 720px;
  color: #7b6a58;
  line-height: 1.8;
  font-size: 1rem;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-self: end;
}

.stat-card {
  padding: 22px 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
  backdrop-filter: blur(12px);
}

.stat-card:first-child {
  background: rgba(255, 255, 255, 0.28);
}

.stat-card:last-child {
  background: rgba(204, 213, 174, 0.34);
  border: 1px solid rgba(169, 184, 130, 0.22);
}

.stat-card strong {
  display: block;
  margin-bottom: 8px;
  font-size: 2rem;
  color: #5f4b3a;
}

.stat-card span {
  color: #7b6a58;
  font-weight: 700;
  line-height: 1.5;
}

.content-area {
  position: relative;
  z-index: 1;
  width: min(1440px, calc(100% - 48px));
  margin: 0 auto;
  padding: 10px 0 48px;
  display: flex;
  flex-direction: column;
  gap: 18px;
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
  transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  background: rgba(204, 213, 174, 0.55);
  color: #556246;
  border: 1px solid rgba(169, 184, 130, 0.2);
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.06);
  backdrop-filter: blur(8px);
}

.back-btn:hover {
  transform: translateY(-2px);
  background: rgba(204, 213, 174, 0.78);
  box-shadow: 0 14px 24px rgba(92, 75, 59, 0.1);
}

.page-header {
  display: grid;
  gap: 0.35rem;
  margin-bottom: 4px;
}

.page-header h2 {
  margin: 0;
  font-size: 2rem;
  color: #5f4b3a;
}

.page-header p {
  margin: 0;
  color: #8a7764;
  font-size: 1rem;
  line-height: 1.7;
}

.categorias-stack {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.categoria-card,
.empty-state {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.07);
  backdrop-filter: blur(12px);
}

.categoria-card {
  position: relative;
  overflow: hidden;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
}

.categoria-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 38px rgba(92, 75, 59, 0.1);
  border-color: rgba(212, 163, 115, 0.22);
}

.card-glow {
  position: absolute;
  top: -36px;
  right: -20px;
  width: 120px;
  height: 120px;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.14);
  filter: blur(18px);
  pointer-events: none;
}

.categoria-header h3 {
  margin: 0 0 6px;
  color: #5f4b3a;
  font-size: 1.45rem;
}

.categoria-header p {
  margin: 0;
  color: #6d7d55;
  font-weight: 800;
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
  cursor: pointer;
  flex: 0 0 210px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.24s ease;
}

.imagen-card:hover {
  transform: translateY(-4px);
}

.imagen-frame {
  width: 100%;
  aspect-ratio: 1 / 1;
  max-height: 220px;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.34);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 12px 24px rgba(92, 75, 59, 0.08);
}

.imagen-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.32s ease;
}

.imagen-card:hover .imagen-frame img {
  transform: scale(1.04);
}

.imagen-info {
  padding: 0 4px;
}

.imagen-info h4 {
  margin: 0;
  color: #5f4b3a;
  font-size: 0.98rem;
  line-height: 1.4;
}

.sin-imagen {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #8a7764;
  font-weight: 700;
}

.carousel-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
  color: #8d633c;
  font-size: 1.8rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.08);
  transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
  backdrop-filter: blur(8px);
}

.carousel-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 14px 24px rgba(92, 75, 59, 0.12);
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
  background: rgba(255, 244, 244, 0.6);
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

.image-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(45, 34, 24, 0.62);
  backdrop-filter: blur(10px);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 300;
}

.image-modal-card {
  position: relative;
  width: min(92vw, 860px);
  max-height: 90vh;
  padding: 20px;
  border-radius: 30px;
  background: rgba(255, 251, 244, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.42);
  box-shadow: 0 28px 60px rgba(45, 34, 24, 0.24);
  display: flex;
  flex-direction: column;
  gap: 14px;
  backdrop-filter: blur(14px);
}

.image-modal-media-wrap {
  width: 100%;
  max-height: 72vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(250, 237, 205, 0.45) 0%, rgba(255, 255, 255, 0.62) 100%);
  overflow: hidden;
}

.image-modal-img {
  width: 100%;
  max-height: 68vh;
  object-fit: contain;
  border-radius: 18px;
  display: block;
}

.image-modal-info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 4px 2px;
}

.image-modal-info h4 {
  margin: 0;
  color: #5f4b3a;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.5;
}

.image-modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 1.05rem;
  font-weight: 900;
  background: rgba(255, 240, 240, 0.9);
  color: #a14444;
  box-shadow: 0 8px 18px rgba(161, 68, 68, 0.1);
  transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
  display: grid;
  place-items: center;
}

.image-modal-close:hover {
  transform: translateY(-2px) scale(1.03);
  background: rgba(255, 228, 228, 1);
  box-shadow: 0 12px 20px rgba(161, 68, 68, 0.14);
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

@media (max-width: 1080px) {
  .hero-strip {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .galeria-carousel {
    grid-template-columns: 1fr;
  }

  .carousel-btn {
    display: none;
  }
}

@media (max-width: 768px) {
  .galeria-page {
    padding: 0;
  }

  .hero-strip,
  .content-area {
    width: min(100% - 28px, 1440px);
    margin-left: auto;
    margin-right: auto;
  }

  .hero-strip {
    padding-top: 28px;
    gap: 18px;
  }

  .hero-copy h1 {
    font-size: 2.4rem;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }

  .categoria-card,
  .empty-state {
    padding: 18px;
    border-radius: 22px;
  }

  .page-header h2 {
    font-size: 1.5rem;
  }

  .imagen-card {
    flex-basis: 180px;
  }

  .image-modal-card {
    width: 100%;
    padding: 14px;
    border-radius: 24px;
    gap: 10px;
  }

  .image-modal-media-wrap {
    padding: 6px;
    border-radius: 18px;
  }

  .image-modal-img {
    max-height: 62vh;
    border-radius: 14px;
  }

  .image-modal-close {
    top: 10px;
    right: 10px;
    width: 36px;
    height: 36px;
  }
}

/*sube we */

</style>