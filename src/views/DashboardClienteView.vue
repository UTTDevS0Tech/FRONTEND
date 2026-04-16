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
        <div class="hero-blur blur-1"></div>
        <div class="hero-blur blur-2"></div>
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
    linear-gradient(180deg, #fefae0 0%, #fbf3e3 42%, #f6edde 100%);
  color: #5f4b3a;
  overflow-x: hidden;
  animation: pageFade 0.8s ease;
}

.page-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(44px);
  pointer-events: none;
  z-index: 0;
}

.glow-1 {
  top: 120px;
  left: -80px;
  width: 260px;
  height: 260px;
  background: rgba(212, 163, 115, 0.12);
}

.glow-2 {
  right: -100px;
  top: 680px;
  width: 320px;
  height: 320px;
  background: rgba(204, 213, 174, 0.2);
}

.page-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.18) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.18), transparent 55%);
  pointer-events: none;
  z-index: 0;
}

.top-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 2rem;
  background: rgba(254, 250, 224, 0.78);
  border-bottom: 1px solid rgba(212, 163, 115, 0.12);
  backdrop-filter: blur(18px);
}

.brand {
  display: flex;
  align-items: center;
  min-width: fit-content;
}

.brand img {
  height: 46px;
  width: auto;
  object-fit: contain;
  transition: transform 0.25s ease;
}

.brand img:hover {
  transform: scale(1.04);
}

.nav-links {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-links a {
  color: #5f4b3a;
  text-decoration: none;
  font-weight: 800;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  transition:
    background 0.22s ease,
    transform 0.22s ease,
    color 0.22s ease;
}

.nav-links a:hover {
  background: rgba(212, 163, 115, 0.14);
  transform: translateY(-2px);
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.72rem;
  border: none;
  border-radius: 16px;
  padding: 0.92rem 1.2rem;
  background: rgba(255, 228, 228, 0.98);
  color: #a14444;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(161, 68, 68, 0.1);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
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
  min-height: 88vh;
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
  background:
    linear-gradient(
      100deg,
      rgba(95, 75, 58, 0.72) 0%,
      rgba(95, 75, 58, 0.34) 42%,
      rgba(95, 75, 58, 0.2) 100%
    );
}

.hero-blur {
  position: absolute;
  border-radius: 999px;
  filter: blur(24px);
  pointer-events: none;
}

.blur-1 {
  left: 8%;
  top: 18%;
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.12);
}

.blur-2 {
  right: 12%;
  bottom: 12%;
  width: 240px;
  height: 240px;
  background: rgba(212, 163, 115, 0.16);
}

.hero-content {
  position: relative;
  z-index: 2;
  width: min(1180px, 100%);
  padding: 2rem;
  text-align: center;
  color: white;
  animation: riseIn 1s ease;
}

.hero-badge {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.58rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-weight: 800;
  backdrop-filter: blur(8px);
}

.hero-content h1 {
  margin: 0 auto 1rem;
  max-width: 900px;
  font-size: clamp(2.8rem, 5vw, 5.2rem);
  line-height: 1.03;
  text-wrap: balance;
}

.hero-content p {
  max-width: 760px;
  margin: 0 auto 1.7rem;
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
  background: linear-gradient(135deg, #d4a373 0%, #c88f59 100%);
  color: white;
  font-weight: 900;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 16px 30px rgba(212, 163, 115, 0.28);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;
}

.hero-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 36px rgba(212, 163, 115, 0.34);
  filter: brightness(1.02);
}

.pending-section {
  position: relative;
  z-index: 1;
  padding: 3.4rem 2rem 1.5rem;
}

.pending-shell {
  width: min(1480px, 100%);
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.54);
  border-radius: 30px;
  padding: 1.6rem;
  box-shadow: 0 18px 34px rgba(92, 75, 59, 0.08);
  border: 1px solid rgba(236, 231, 216, 0.82);
  backdrop-filter: blur(12px);
}

.pending-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 1.15rem;
  flex-wrap: wrap;
}

.pending-head h2,
.pending-head p {
  margin: 0;
}

.pending-head h2 {
  font-size: clamp(1.7rem, 3vw, 2.2rem);
  color: #5f4b3a;
}

.pending-head p {
  color: #8a7764;
  line-height: 1.65;
  max-width: 460px;
}

.section-tag {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 0.82rem;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.16);
  color: #8d633c;
  font-size: 0.82rem;
  font-weight: 800;
  margin-bottom: 0.72rem;
}

.cards-grid {
  display: grid;
  gap: 1rem;
}

.cita-card {
  border-radius: 24px;
  padding: 1.15rem;
  background: rgba(254, 250, 224, 0.78);
  border: 1px solid rgba(212, 163, 115, 0.18);
  display: grid;
  gap: 0.95rem;
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease,
    border-color 0.24s ease;
}

.cita-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 28px rgba(92, 75, 59, 0.08);
  border-color: rgba(212, 163, 115, 0.28);
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
  background: rgba(255, 228, 228, 0.95);
  color: #9d3e3e;
}

.empty-state {
  background: rgba(255, 255, 255, 0.68);
  color: #7b6a58;
  border: 1px dashed rgba(212, 163, 115, 0.28);
}

.empty-state.loading {
  background: rgba(250, 237, 205, 0.55);
}

.gallery {
  position: relative;
  z-index: 1;
  padding: 3.6rem 2rem 5rem;
}

.section-head {
  text-align: center;
  margin-bottom: 2.4rem;
}

.section-head span {
  color: #d4a373;
  font-weight: 800;
}

.section-head h2 {
  margin: 0.55rem 0 0;
  font-size: clamp(2rem, 4vw, 3rem);
  color: #5f4b3a;
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
  gap: 0.95rem;
}

.gallery-card {
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 16px 30px rgba(92, 75, 59, 0.12);
  background: #faedcd;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
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
  transition:
    transform 0.22s ease,
    background 0.22s ease;
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
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.dot:hover {
  transform: scale(1.08);
}

.dot.active {
  background: #d4a373;
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
  padding: 2.8rem 2rem;
  background:
    linear-gradient(135deg, rgba(204, 213, 174, 0.96) 0%, rgba(233, 237, 201, 0.88) 100%);
  color: #5f4b3a;
  border-top: 1px solid rgba(95, 75, 58, 0.08);
}

.about-bar h3,
.about-bar h4 {
  margin-top: 0;
  margin-bottom: 0.65rem;
}

.about-bar p {
  margin: 0.35rem 0;
  line-height: 1.7;
}

.slide-page-enter-active,
.slide-page-leave-active {
  transition:
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.65s ease;
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

@media (max-width: 1100px) {
  .top-nav {
    padding: 1rem 1.2rem;
    flex-direction: column;
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
}

@media (max-width: 768px) {
  .hero {
    min-height: 72vh;
  }

  .hero-content {
    padding: 1.4rem;
  }

  .hero-content h1 {
    font-size: clamp(2.2rem, 8vw, 3.2rem);
  }

  .hero-content p {
    font-size: 1rem;
    line-height: 1.75;
  }

  .pending-shell {
    padding: 1.2rem;
    border-radius: 24px;
  }
}

@media (max-width: 640px) {
  .top-nav {
    gap: 0.9rem;
  }

  .nav-links {
    gap: 0.45rem;
  }

  .nav-links a {
    width: 100%;
    text-align: center;
  }

  .logout-btn {
    width: 100%;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .hero-btn {
    width: 100%;
    max-width: 320px;
  }

  .gallery-action-btn {
    max-width: 360px;
  }

  .pending-shell {
    padding: 1rem;
    border-radius: 22px;
  }

  .section-head h2 {
    font-size: 2rem;
  }
}
</style>