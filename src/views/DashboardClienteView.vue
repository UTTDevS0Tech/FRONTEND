<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function cerrarSesion() {
  authStore.logout()
  router.push('/login')
}

const imagenesGaleria = [
  { src: new URL('@/assets/galeria1.jpg', import.meta.url).href, alt: 'Galería 1' },
  { src: new URL('@/assets/galeria2.jpg', import.meta.url).href, alt: 'Galería 2' },
  { src: new URL('@/assets/galeria3.jpg', import.meta.url).href, alt: 'Galería 3' },
  { src: new URL('@/assets/galeria4.jpg', import.meta.url).href, alt: 'Galería 4' },
  { src: new URL('@/assets/galeria5.jpg', import.meta.url).href, alt: 'Galería 5' },
  { src: new URL('@/assets/galeria6.jpg', import.meta.url).href, alt: 'Galería 6' },
  { src: new URL('@/assets/galeria7.jpg', import.meta.url).href, alt: 'Galería 7' },
  { src: new URL('@/assets/galeria8.jpg', import.meta.url).href, alt: 'Galería 8' },
]

const visiblesPorVista = 4
const indiceActual = ref(0)

const totalPaginas = computed(() =>
  Math.ceil(imagenesGaleria.length / visiblesPorVista)
)

function siguienteSlide() {
  indiceActual.value =
    indiceActual.value < totalPaginas.value - 1 ? indiceActual.value + 1 : 0
}

function anteriorSlide() {
  indiceActual.value =
    indiceActual.value > 0 ? indiceActual.value - 1 : totalPaginas.value - 1
}

function irAPagina(index: number) {
  indiceActual.value = index
}

/* autoplay */
let intervalo: number | null = null

function iniciarCarrusel() {
  intervalo = window.setInterval(() => {
    siguienteSlide()
  }, 4000)
}

function pausarCarrusel() {
  if (intervalo) {
    clearInterval(intervalo)
    intervalo = null
  }
}

function reanudarCarrusel() {
  if (!intervalo) iniciarCarrusel()
}

onMounted(() => iniciarCarrusel())
onUnmounted(() => {
  if (intervalo) clearInterval(intervalo)
})
</script>

<template>
  <main class="client-home">
    <!-- NAV -->
    <header class="top-nav">
      <div class="brand">
        <img src="@/assets/logolargo.png" />
      </div>

      <nav class="nav-links">
        <a>Home</a>
        <a>Estilistas</a>
        <a>Servicios</a>
        <a>Perfil</a>
      </nav>

      <button class="logout-btn" @click="cerrarSesion">
        Cerrar sesión
      </button>
    </header>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-image">
        <img src="@/assets/banner-principal.jpg" />
        <div class="hero-overlay"></div>
      </div>

      <div class="hero-content">
        <span class="hero-badge">Bienvenida</span>
        <h1>Tu espacio para relajarte, renovarte y verte increíble</h1>
        <p>Descubre nuestros servicios y agenda tu cita fácilmente.</p>
        <button class="hero-btn" @click="router.push('/dashboard/cliente/cita')">
          Agendar cita
        </button>
      </div>
    </section>

    <!-- GALERÍA CARRUSEL -->
    <section class="gallery">
      <div class="section-head">
        <span>Nuestra Galería</span>
        <h2>Momentos y espacios</h2>
      </div>

      <div
        class="carousel-shell"
        @mouseenter="pausarCarrusel"
        @mouseleave="reanudarCarrusel"
      >
        <button class="carousel-btn" @click="anteriorSlide">‹</button>

        <div class="carousel-viewport">
          <div
            class="carousel-track"
            :style="{ transform: `translateX(-${indiceActual * 100}%)` }"
          >
            <div
              v-for="pagina in totalPaginas"
              :key="pagina"
              class="carousel-page"
            >
              <div class="gallery-grid">
                <div
                  v-for="imagen in imagenesGaleria.slice((pagina - 1) * visiblesPorVista, pagina * visiblesPorVista)"
                  :key="imagen.src"
                  class="gallery-card"
                >
                  <img :src="imagen.src" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="carousel-btn" @click="siguienteSlide">›</button>
      </div>

      <div class="carousel-dots">
        <button
          v-for="(_, i) in totalPaginas"
          :key="i"
          class="dot"
          :class="{ active: indiceActual === i }"
          @click="irAPagina(i)"
        ></button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.client-home {
  background: #FEFAE0;
}

/* NAV */
.top-nav {
  display: flex;
  justify-content: space-between;
  padding: 1.2rem 3rem;
}

.logout-btn {
  background: #ffe2e2;
  border-radius: 14px;
  padding: 0.8rem 1rem;
  cursor: pointer;
}

/* HERO */
.hero {
  position: relative;
  min-height: 80vh;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-content {
  position: relative;
  text-align: center;
  color: white;
}

/* GALERÍA */
.gallery {
  padding: 4rem 2rem;
}

.carousel-shell {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
}

.carousel-viewport {
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.carousel-page {
  min-width: 100%;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

/* 🔥 IMÁGENES UNIFORMES */
.gallery-card {
  aspect-ratio: 4 / 3;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
}

.gallery-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-card:hover img {
  transform: scale(1.05);
}

/* BOTONES */
.carousel-btn {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.8rem;
  background: rgba(212,163,115,0.2);
  cursor: pointer;
}

/* DOTS */
.carousel-dots {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
}

.dot.active {
  background: #D4A373;
}
</style>