<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { usePerfilStore } from '@/stores/perfil'
import type { PerfilClienteCita } from '@/types'

const authStore = useAuthStore()
const router = useRouter()
const perfilStore = usePerfilStore()

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

function normalizarHora(valor?: string | null) {
  return valor ? valor.slice(0, 5) : ''
}

function formatearFecha(valor: string) {
  if (!valor) return 'Fecha pendiente'

  const partes = valor.slice(0, 10).split('-')
  const anio = Number(partes[0])
  const mes = Number(partes[1])
  const dia = Number(partes[2])

  if (!anio || !mes || !dia) return valor

  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(anio, mes - 1, dia))
}

function formatearHora(valor?: string | null) {
  const horaNormalizada = normalizarHora(valor)

  if (!horaNormalizada) return 'Por definir'

  const partes = horaNormalizada.split(':')
  const hora = Number(partes[0])
  const minuto = Number(partes[1])

  if (Number.isNaN(hora) || Number.isNaN(minuto)) return horaNormalizada

  const fecha = new Date()
  fecha.setHours(hora, minuto, 0, 0)

  return new Intl.DateTimeFormat('es-MX', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(fecha)
}

function resumenHorario(cita: PerfilClienteCita) {
  const inicio = formatearHora(cita.hora_c)
  const fin = cita.hora_fin ? formatearHora(cita.hora_fin) : ''
  return fin ? `${inicio} - ${fin}` : inicio
}

function serviciosTexto(cita: PerfilClienteCita) {
  if (!cita.detalles?.length) return 'Sin servicios registrados'
  return cita.detalles.map((detalle) => detalle.servicio || 'Servicio').join(', ')
}

function totalTexto(cita: PerfilClienteCita) {
  if (cita.total === null || cita.total === undefined || cita.total === '') {
    return 'Por definir'
  }

  const total = Number(cita.total)
  if (Number.isNaN(total)) return String(cita.total)

  return `$${total.toFixed(2)}`
}

function claseEstado(estado: PerfilClienteCita['estado']) {
  return `estado-${estado}`
}

onMounted(() => {
  iniciarCarrusel()
  perfilStore.obtenerMisCitas()
})

onUnmounted(() => {
  if (intervalo !== null) clearInterval(intervalo)
})
</script>

<template>
  <main class="client-home">
    <div class="page-glow glow-1"></div>
    <div class="page-glow glow-2"></div>
    <div class="page-glow glow-3"></div>
    <div class="page-pattern"></div>

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
        <img src="@/assets/cerrarssesion.svg" alt="" aria-hidden="true" class="btn-icon" />
        <span>Cerrar sesión</span>
      </button>
    </header>

    <section class="hero">
      <div class="hero-image">
        <img src="@/assets/banner-principal.jpg" alt="Interior de la estética" />
        <div class="hero-overlay"></div>
      </div>

      <div class="hero-content">
        <span class="hero-badge">Bienvenid@</span>
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

    <section class="pending-section">
      <div class="pending-shell">
        <div class="pending-head">
          <div>
            <span class="section-tag">Agenda activa</span>
            <h2>Citas pendientes</h2>
          </div>
          <p>Recuerda: Si necesitas Reagendar o Cancelar debes contactar a nuestro local para hacerlo.</p>
        </div>

        <div v-if="perfilStore.loadingCitas" class="empty-state loading">
          Cargando tus citas...
        </div>

        <div v-else-if="perfilStore.errorCitas" class="alert error">
          {{ perfilStore.errorCitas }}
        </div>

        <div v-else-if="perfilStore.citasPendientes.length === 0" class="empty-state">
          No tienes citas pendientes por ahora.
        </div>

        <div v-else class="cards-grid">
          <article
            v-for="cita in perfilStore.citasPendientes"
            :key="`pendiente-${cita.id}`"
            class="cita-card"
          >
            <div class="cita-top">
              <div>
                <h3>Cita #{{ cita.id }}</h3>
                <p>{{ formatearFecha(cita.fecha_c) }}</p>
              </div>

              <span class="estado-pill" :class="claseEstado(cita.estado)">
                {{ cita.estado }}
              </span>
            </div>

            <dl class="cita-meta">
              <div>
                <dt>Horario</dt>
                <dd>{{ resumenHorario(cita) }}</dd>
              </div>
              <div>
                <dt>Estilista</dt>
                <dd>{{ cita.personal || 'Sin asignar' }}</dd>
              </div>
              <div>
                <dt>Servicios</dt>
                <dd>{{ serviciosTexto(cita) }}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{{ totalTexto(cita) }}</dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>

    <section class="gallery">
      <div class="gallery-shell">
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

        <button class="hero-btn gallery-action-btn" @click="router.push('/dashboard/cliente/galeria')">
          <img src="@/assets/galeria.svg" alt="" aria-hidden="true" class="btn-icon" />
          <span>Ver galería completa</span>
        </button>
      </div>
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
  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(233, 237, 201, 0.9), transparent 26%),
    radial-gradient(circle at bottom right, rgba(212, 163, 115, 0.18), transparent 24%),
    linear-gradient(180deg, #fefae0 0%, #fbf5e9 46%, #f6edde 100%);
  color: #5f4b3a;
  overflow-x: hidden;
  animation: pageFade 0.8s ease;
}

.page-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(48px);
  pointer-events: none;
  z-index: 0;
}

.glow-1 {
  top: 560px;
  left: -110px;
  width: 260px;
  height: 260px;
  background: rgba(212, 163, 115, 0.1);
}

.glow-2 {
  right: -130px;
  top: 1080px;
  width: 320px;
  height: 320px;
  background: rgba(204, 213, 174, 0.2);
}

.glow-3 {
  left: 35%;
  top: 920px;
  width: 220px;
  height: 220px;
  background: rgba(250, 237, 205, 0.4);
}

.page-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.14) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), transparent 62%);
  pointer-events: none;
  z-index: 0;
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

.logout-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
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

.btn-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  object-fit: contain;
}

.hero {
  position: relative;
  min-height: 82vh;
  display: grid;
  place-items: center;
  overflow: hidden;
  z-index: 1;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.72rem;
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

.pending-section {
  position: relative;
  z-index: 1;
  padding: 3rem 3rem 1rem;
  background: transparent;
}

.pending-shell {
  width: min(1480px, 100%);
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(12px);
}

.pending-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.pending-head h2,
.pending-head p {
  margin: 0;
}

.pending-head h2 {
  font-size: 1.8rem;
  color: #5f4b3a;
}

.pending-head p {
  color: #8a7764;
  line-height: 1.6;
  max-width: 420px;
}

.section-tag {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.14);
  color: #8d633c;
  font-size: 0.82rem;
  font-weight: 800;
  margin-bottom: 10px;
  backdrop-filter: blur(8px);
}

.cards-grid {
  display: grid;
  gap: 14px;
}

.cita-card {
  border-radius: 22px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.24);
  display: grid;
  gap: 14px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 24px rgba(92, 75, 59, 0.05);
  transition: transform 0.26s ease, box-shadow 0.26s ease, border-color 0.26s ease;
}

.cita-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 30px rgba(92, 75, 59, 0.08);
  border-color: rgba(212, 163, 115, 0.22);
}

.cita-top {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
}

.cita-top h3,
.cita-top p {
  margin: 0;
}

.cita-top h3 {
  color: #5f4b3a;
  font-size: 1.1rem;
}

.cita-top p {
  margin-top: 4px;
  color: #8a7764;
  text-transform: capitalize;
}

.cita-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
}

.cita-meta div {
  display: grid;
  gap: 4px;
  padding: 0.85rem 0.9rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.cita-meta dt {
  color: #8a7764;
  font-weight: 700;
}

.cita-meta dd {
  margin: 0;
  font-weight: 700;
  line-height: 1.5;
  color: #5f4b3a;
}

.estado-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 999px;
  text-transform: capitalize;
  font-size: 0.88rem;
  font-weight: 900;
  white-space: nowrap;
}

.estado-pendiente {
  background: rgba(250, 237, 205, 0.95);
  color: #8d633c;
}

.estado-confirmada {
  background: rgba(204, 213, 174, 0.95);
  color: #48623b;
}

.estado-cancelada {
  background: rgba(255, 228, 228, 0.92);
  color: #9d3e3e;
}

.estado-completada {
  background: rgba(220, 232, 250, 0.92);
  color: #355886;
}

.alert,
.empty-state {
  border-radius: 18px;
  padding: 14px 16px;
  font-weight: 700;
}

.alert.error {
  background: rgba(255, 228, 228, 0.86);
  color: #9d3e3e;
  border: 1px solid rgba(161, 68, 68, 0.14);
}

.empty-state {
  background: rgba(255, 255, 255, 0.22);
  color: #7b6a58;
  border: 1px dashed rgba(212, 163, 115, 0.28);
  backdrop-filter: blur(10px);
}

.empty-state.loading {
  background: rgba(250, 237, 205, 0.34);
}

.gallery {
  position: relative;
  z-index: 1;
  padding: 4rem 3rem 5rem;
  background: transparent;
}

.gallery-shell {
  width: min(1720px, 100%);
  margin: 0 auto;
  padding: 1.8rem;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(12px);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.06);
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
  width: 100%;
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
  box-shadow: 0 16px 30px rgba(92, 75, 59, 0.10);
  background: rgba(255, 255, 255, 0.14);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  aspect-ratio: 3 / 4;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.gallery-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 26px 42px rgba(92, 75, 59, 0.14);
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
  background: rgba(255, 255, 255, 0.22);
  color: #8d633c;
  font-size: 2rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.06);
  transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
  backdrop-filter: blur(8px);
}

.carousel-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.34);
  box-shadow: 0 16px 24px rgba(92, 75, 59, 0.1);
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

.gallery-action-btn {
  margin: 2rem auto 0;
}

.about-bar {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 2rem;
  padding: 2.6rem 3rem;
  background: transparent;
  color: #5f4b3a;
  border-top: 1px solid rgba(212, 163, 115, 0.14);
}

.about-bar h3,
.about-bar h4 {
  margin-top: 0;
  margin-bottom: 0.6rem;
  font-weight: 800;
}

.about-bar p {
  margin: 0.35rem 0;
  line-height: 1.7;
  color: #7d6855;
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

@media (max-width: 900px) {
  .top-nav {
    padding: 1rem 1.2rem;
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    justify-content: center;
  }

  .pending-section,
  .gallery,
  .about-bar {
    padding-left: 1.2rem;
    padding-right: 1.2rem;
  }

  .pending-head,
  .cita-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .cita-meta {
    grid-template-columns: 1fr;
  }

  .carousel-shell {
    grid-template-columns: 1fr;
  }

  .carousel-btn {
    display: none;
  }

  .gallery-grid {
    grid-template-columns: 1fr 1fr;
  }

  .about-bar {
    grid-template-columns: 1fr;
  }

  .pending-shell,
  .gallery-shell {
    padding: 18px;
    border-radius: 22px;
  }
}

@media (max-width: 640px) {
  .hero-content h1 {
    font-size: 2.4rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .pending-shell,
  .gallery-shell {
    padding: 16px;
    border-radius: 20px;
  }

  .logout-btn {
    width: 100%;
  }

  .hero-btn {
    width: 100%;
    max-width: 320px;
  }

  .gallery-action-btn {
    max-width: 360px;
  }
}
</style>