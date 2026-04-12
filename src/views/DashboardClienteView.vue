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
  { src: new URL('@/assets/galeria1.jpg', import.meta.url).href, alt: 'Galería 1', position: 'center top' },
  { src: new URL('@/assets/galeria2.jpg', import.meta.url).href, alt: 'Galería 2', position: 'center 30%' },
  { src: new URL('@/assets/galeria3.jpg', import.meta.url).href, alt: 'Galería 3', position: 'center 40%' },
  { src: new URL('@/assets/galeria4.jpg', import.meta.url).href, alt: 'Galería 4', position: 'center 25%' },
  { src: new URL('@/assets/galeria5.jpg', import.meta.url).href, alt: 'Galería 5', position: 'center center' },
  { src: new URL('@/assets/galeria6.jpg', import.meta.url).href, alt: 'Galería 6', position: '70% center' },
  { src: new URL('@/assets/galeria7.jpg', import.meta.url).href, alt: 'Galería 7', position: 'center center' },
  { src: new URL('@/assets/galeria8.jpg', import.meta.url).href, alt: 'Galería 8', position: '40% 30%' },
]

const visiblesPorVista = 4
const indiceActual = ref(0)

const totalPaginas = computed(() =>
  Math.ceil(imagenesGaleria.length / visiblesPorVista)
)

const imagenesVisibles = computed(() => {
  const inicio = indiceActual.value * visiblesPorVista
  return imagenesGaleria.slice(inicio, inicio + visiblesPorVista)
})

function siguienteSlide() {
  if (indiceActual.value < totalPaginas.value - 1) {
    indiceActual.value++
  } else {
    indiceActual.value = 0
  }
}

function anteriorSlide() {
  if (indiceActual.value > 0) {
    indiceActual.value--
  } else {
    indiceActual.value = totalPaginas.value - 1
  }
}

function irAPagina(index: number) {
  indiceActual.value = index
}

let intervalo: number | null = null

function iniciarCarrusel() {
  intervalo = window.setInterval(() => {
    siguienteSlide()
  }, 4000)
}

function pausarCarrusel() {
  if (intervalo !== null) {
    clearInterval(intervalo)
    intervalo = null
  }
}

function reanudarCarrusel() {
  if (intervalo === null) {
    iniciarCarrusel()
  }
}

onMounted(() => {
  iniciarCarrusel()
})

onUnmounted(() => {
  if (intervalo !== null) clearInterval(intervalo)
})
</script>

<template>
  <main class="client-home">
    <header class="top-nav">
      <div class="brand">
        <img src="@/assets/logolargo.png" alt="Estética Nova" />
      </div>

      <nav class="nav-links">
        <router-link to="/dashboard/cliente">Home</router-link>
        <router-link to="/dashboard/cliente/estilistas">Estilistas</router-link>
        <router-link to="/dashboard/cliente/servicios">Servicios</router-link>
        <router-link to="/dashboard/cliente/galeria">Galería</router-link>
        <router-link to="/dashboard/cliente/perfil">Perfil</router-link>
      </nav>

      <button class="logout-btn" @click="cerrarSesion">
        Cerrar sesión
      </button>
    </header>

    <section class="hero">
      <div class="hero-image">
        <img src="@/assets/banner-principal.jpg" alt="Interior de la estética" />
        <div class="hero-overlay"></div>
      </div>

      <div class="hero-content">
        <span class="hero-badge">Bienvenida</span>
        <h1>Tu espacio para relajarte, renovarte y verte increíble</h1>
        <p>
          Descubre nuestros servicios, conoce a nuestro equipo y agenda tu cita
          en un ambiente pensado para tu bienestar.
        </p>
        <button class="hero-btn" @click="router.push('/dashboard/cliente/cita')">
          Agendar cita
        </button>
      </div>
    </section>

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
        <button class="carousel-btn" @click="anteriorSlide">
          ‹
        </button>

        <div class="carousel-viewport">
          <transition name="slide-page" mode="out-in">
            <div :key="indiceActual" class="gallery-grid">
              <div
                v-for="imagen in imagenesVisibles"
                :key="`${indiceActual}-${imagen.src}`"
                class="gallery-card"
              >
                <img
                :src="imagen.src"
                :alt="imagen.alt"
                :style="{ objectPosition: imagen.position }"
                />
              </div>
            </div>
          </transition>
        </div>

        <button class="carousel-btn" @click="siguienteSlide">
          ›
        </button>
      </div>

      <div class="carousel-dots">
        <button
          v-for="(_, index) in totalPaginas"
          :key="index"
          class="dot"
          :class="{ active: indiceActual === index }"
          @click="irAPagina(index)"
        ></button>
      </div>
      <button class="hero-btn" @click="router.push('/dashboard/cliente/galeria')">
        Ver galería completa
      </button>
    </section>

    <footer class="about-bar">
      <div>
        <h3>Sobre Nosotros</h3>
        <p>Un espacio dedicado al cuidado personal, la belleza y el bienestar.</p>
      </div>

      <div>
        <h4>Dirección</h4>
        <p>*****************</p>
      </div>

      <div>
        <h4>Contacto</h4>
        <p>Tel. 000 000 0000</p>
        <p>estetica@gmail.com</p>
      </div>
    </footer>
  </main>
</template>

<style scoped>
.client-home {
  min-height: 100vh;
  background: #FEFAE0;
  color: #5f4b3a;
  animation: pageFade 0.8s ease;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 3.2rem;
  background: rgba(254, 250, 224, 0.96);
  border-bottom: 1px solid rgba(212, 163, 115, 0.15);
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(12px);
}

.brand {
  display: flex;
  align-items: center;
}

.brand img {
  height: 44px;
  width: auto;
  object-fit: contain;
  transition: transform 0.25s ease;
}

.brand img:hover {
  transform: scale(1.06);
}

.nav-links {
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-links a {
  color: #5f4b3a;
  text-decoration: none;
  font-weight: 800;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  transition: 0.25s ease;
}

.nav-links a:hover {
  background: rgba(212, 163, 115, 0.14);
  transform: translateY(-2px);
}

.hero {
  position: relative;
  min-height: 82vh;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  inset: 0;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: zoomSlow 12s ease-in-out infinite alternate;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(95, 75, 58, 0.60),
    rgba(95, 75, 58, 0.26)
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  width: min(1100px, 100%);
  padding: 2rem;
  text-align: center;
  color: white;
  animation: riseIn 1s ease;
}

.hero-badge {
  display: inline-block;
  margin-bottom: 1.1rem;
  padding: 0.55rem 0.95rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-weight: 800;
}

.hero-content h1 {
  margin: 0 auto 1rem;
  max-width: 860px;
  font-size: clamp(3rem, 5vw, 5rem);
  line-height: 1.05;
}

.hero-content p {
  max-width: 760px;
  margin: 0 auto 1.6rem;
  line-height: 1.9;
  font-size: 1.08rem;
}

.hero-btn {
  border: none;
  border-radius: 18px;
  padding: 1.05rem 1.7rem;
  background: #D4A373;
  color: white;
  font-weight: 900;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 16px 30px rgba(212, 163, 115, 0.28);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.hero-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 36px rgba(212, 163, 115, 0.34);
}

.gallery {
  padding: 5rem 3rem;
  background: #FEFAE0;
}

.section-head {
  text-align: center;
  margin-bottom: 2.6rem;
}

.section-head span {
  color: #D4A373;
  font-weight: 800;
}

.section-head h2 {
  margin: 0.55rem 0 0;
  font-size: 2.6rem;
}

.carousel-shell {
  width: min(1720px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.2rem;
}

.carousel-viewport {
  overflow: hidden;
  width: 100%;
  min-height: 340px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.8rem;
}

.gallery-card {
  border-radius: 26px;
  overflow: hidden;
  box-shadow: 0 16px 30px rgba(92, 75, 59, 0.12);
  background: #FAEDCD;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  aspect-ratio: 3 / 4;
  width: 100%;
}

.gallery-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 26px 42px rgba(92, 75, 59, 0.18);
}

.gallery-card img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
  transition: transform 0.4s ease;
}

.gallery-card:hover img {
  transform: scale(1.05);
}

.carousel-btn {
  width: 54px;
  height: 54px;
  border: none;
  border-radius: 50%;
  background: rgba(212, 163, 115, 0.18);
  color: #8d633c;
  font-size: 2rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.08);
  transition: transform 0.22s ease, background 0.22s ease;
}

.carousel-btn:hover {
  transform: translateY(-2px);
  background: rgba(212, 163, 115, 0.28);
}

.carousel-dots {
  margin-top: 1.8rem;
  display: flex;
  justify-content: center;
  gap: 0.7rem;
}

.dot {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: rgba(212, 163, 115, 0.35);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.dot:hover {
  transform: scale(1.08);
}

.dot.active {
  background: #D4A373;
}

.about-bar {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 2rem;
  padding: 2.5rem 3rem;
  background: #CCD5AE;
  color: #5f4b3a;
}

.about-bar h3,
.about-bar h4 {
  margin-top: 0;
}

.about-bar p {
  margin: 0.35rem 0;
  line-height: 1.7;
}

.logout-btn {
  border: none;
  border-radius: 14px;
  padding: 0.9rem 1.2rem;
  background: rgba(255, 226, 226, 0.96);
  color: #a14444;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(161, 68, 68, 0.10);
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

.logout-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 214, 214, 1);
  box-shadow: 0 14px 24px rgba(161, 68, 68, 0.14);
}

.slide-page-enter-active,
.slide-page-leave-active {
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s ease;
}

.slide-page-enter-from {
  opacity: 0;
  transform: translateX(60px);
}

.slide-page-leave-to {
  opacity: 0;
  transform: translateX(-60px);
}

@keyframes pageFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes riseIn {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomSlow {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.08);
  }
}
</style>
