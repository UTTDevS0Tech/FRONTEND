<script setup lang="ts">
import { onMounted, ref } from 'vue'

const isLoading = ref(true)
const loadingProgress = ref(0)

onMounted(() => {
  let progress = 0

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 18) + 8
    loadingProgress.value = Math.min(progress, 100)

    if (loadingProgress.value >= 100) {
      clearInterval(interval)

      setTimeout(() => {
        isLoading.value = false
      }, 350)
    }
  }, 120)
})
</script>

<template>
  <transition name="loader-fade">
    <div v-if="isLoading" class="loader-screen">
      <div class="loader-content">
        <div class="loader-brand">
          <span class="loader-logo">✦</span>
          <span>Estética Nova</span>
        </div>

        <p class="loader-text">Cargando experiencia...</p>

        <div class="loader-bar">
          <div class="loader-fill" :style="{ width: `${loadingProgress}%` }"></div>
        </div>

        <span class="loader-percent">{{ loadingProgress }}%</span>
      </div>
    </div>
  </transition>

  <main v-show="!isLoading" class="landing-page">
    <section class="hero">
      <div class="bg-zoom"></div>
      <div class="overlay"></div>
      <div class="floating-blur blur-1"></div>
      <div class="floating-blur blur-2"></div>

      <div class="hero-content">
        <div class="brand fade-up delay-1">
          <span class="brand-logo">✦</span>
          <span class="brand-name">Estética Nova</span>
        </div>

        <h1 class="fade-up delay-2">
          Tu espacio para
          <br />
          consentirte, renovarte
          <br />
          y verte increíble
        </h1>

        <p class="fade-up delay-3">
          Agenda tus servicios de forma fácil, conoce nuestro equipo
          y vive una experiencia pensada para tu bienestar.
        </p>

        <div class="hero-actions fade-up delay-4">
          <router-link to="/login" class="btn btn-primary">
            ¿Ya eres cliente? Inicia sesión
          </router-link>

          <router-link to="/register" class="btn btn-secondary">
            Registrarse
          </router-link>
        </div>

        <div class="scroll-indicator fade-up delay-4">
          <span></span>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="features-header">
        <span class="section-tag">Descubre Nova</span>
        <h2>Todo lo que necesitas para agendar sin complicarte</h2>
        <p>
          Diseñado para que encuentres servicios, elijas a tu estilista y reserves
          en minutos.
        </p>
      </div>

      <div class="features-grid">
        <article class="feature-card card-1">
          <div class="icon-wrap">📅</div>
          <h3>Agenda fácil</h3>
          <p>
            Reserva tu cita en pocos pasos y organiza tu tiempo sin llamadas ni
            vueltas innecesarias.
          </p>
        </article>

        <article class="feature-card card-2">
          <div class="icon-wrap">✨</div>
          <h3>Servicios de calidad</h3>
          <p>
            Explora tratamientos y servicios pensados para resaltar tu estilo y
            bienestar.
          </p>
        </article>

        <article class="feature-card card-3">
          <div class="icon-wrap">💇</div>
          <h3>Personal profesional</h3>
          <p>
            Conoce a nuestro equipo y elige a quien mejor se adapte a la experiencia
            que estás buscando.
          </p>
        </article>
      </div>
    </section>

    <section class="cta-section">
      <div class="cta-box">
        <div class="cta-glow"></div>
        <span class="section-tag">Empieza hoy</span>
        <h2>Tu próxima cita está a unos clics</h2>
        <p>
          Inicia sesión si ya eres cliente o crea tu cuenta para comenzar a disfrutar
          de la experiencia Nova.
        </p>

        <div class="hero-actions">
          <router-link to="/login" class="btn btn-primary">
            Iniciar sesión
          </router-link>

          <router-link to="/register" class="btn btn-secondary dark-secondary">
            Crear cuenta
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: #f5f0e6;
  overflow: hidden;
}

/* LOADER */
.loader-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top, rgba(217, 165, 116, 0.22), transparent 35%),
    linear-gradient(135deg, #f5f0e6 0%, #e9dcc7 50%, #d8c2a0 100%);
}

.loader-content {
  width: min(420px, 88vw);
  text-align: center;
  animation: loaderPop 0.7s ease;
}

.loader-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: #7b5b3d;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.loader-logo {
  font-size: 20px;
  animation: spinSoft 4s linear infinite;
}

.loader-text {
  margin: 0 0 16px;
  color: #6f5a45;
  font-size: 0.98rem;
}

.loader-bar {
  width: 100%;
  height: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
}

.loader-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #c9925d 0%, #d9a574 50%, #efd2ae 100%);
  box-shadow: 0 0 20px rgba(201, 146, 93, 0.45);
  transition: width 0.18s ease;
}

.loader-percent {
  display: inline-block;
  margin-top: 12px;
  color: #7b5b3d;
  font-size: 0.92rem;
  font-weight: 700;
}

.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

/* HERO */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  overflow: hidden;
}

.bg-zoom {
  position: absolute;
  inset: 0;
  background-image: url('@/assets/banner-principal.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: slowZoom 18s ease-in-out infinite alternate;
  transform: scale(1);
}

.overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(20, 16, 10, 0.28), rgba(20, 16, 10, 0.5)),
    rgba(68, 56, 34, 0.12);
  backdrop-filter: blur(1.5px);
}

.floating-blur {
  position: absolute;
  border-radius: 999px;
  filter: blur(18px);
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
}

.blur-1 {
  top: 12%;
  left: 8%;
  width: 180px;
  height: 180px;
  background: rgba(255, 226, 180, 0.3);
  animation: blobFloat 10s ease-in-out infinite;
}

.blur-2 {
  right: 8%;
  bottom: 14%;
  width: 240px;
  height: 240px;
  background: rgba(217, 165, 116, 0.22);
  animation: blobFloat 12s ease-in-out infinite reverse;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 920px;
  text-align: center;
  color: #fff;
  padding: 40px 24px;
  animation: floatSoft 5s ease-in-out infinite;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 248, 240, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.brand-logo {
  font-size: 18px;
}

.brand-name {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-content h1 {
  margin: 0;
  font-size: clamp(2.4rem, 6vw, 5.3rem);
  line-height: 1.06;
  font-weight: 300;
  text-shadow: 0 10px 32px rgba(0, 0, 0, 0.2);
}

.hero-content p {
  max-width: 720px;
  margin: 28px auto 0;
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.96);
  text-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.hero-actions {
  margin-top: 36px;
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 220px;
  padding: 15px 26px;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 700;
  font-size: 15px;
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    opacity 0.25s ease;
  will-change: transform;
}

.btn:hover {
  transform: translateY(-5px) scale(1.03);
}

.btn:active {
  transform: translateY(-1px) scale(0.99);
}

.btn-primary {
  background: #d9a574;
  color: white;
  box-shadow: 0 10px 30px rgba(201, 146, 93, 0.35);
}

.btn-primary:hover {
  background: #c9925d;
  box-shadow: 0 14px 34px rgba(201, 146, 93, 0.45);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.14);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.24);
  border-color: rgba(255, 255, 255, 0.5);
}

.dark-secondary {
  color: #7b5b3d;
  border: 1px solid rgba(123, 91, 61, 0.2);
  background: rgba(255, 255, 255, 0.72);
}

.dark-secondary:hover {
  background: rgba(255, 255, 255, 0.92);
}

.scroll-indicator {
  margin-top: 34px;
  display: flex;
  justify-content: center;
}

.scroll-indicator span {
  position: relative;
  width: 28px;
  height: 48px;
  border: 2px solid rgba(255, 255, 255, 0.72);
  border-radius: 999px;
  display: inline-block;
}

.scroll-indicator span::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  width: 6px;
  height: 10px;
  border-radius: 999px;
  background: white;
  transform: translateX(-50%);
  animation: scrollDot 1.8s ease-in-out infinite;
}

/* FEATURES */
.features {
  position: relative;
  padding: 90px 24px;
  background:
    radial-gradient(circle at top, rgba(217, 165, 116, 0.08), transparent 30%),
    #f5f0e6;
}

.features-header {
  max-width: 760px;
  margin: 0 auto 44px;
  text-align: center;
}

.section-tag {
  display: inline-block;
  margin-bottom: 14px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(217, 165, 116, 0.15);
  color: #8d6540;
  font-size: 0.9rem;
  font-weight: 700;
}

.features-header h2,
.cta-box h2 {
  margin: 0;
  color: #5f4530;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.15;
}

.features-header p,
.cta-box p {
  max-width: 700px;
  margin: 18px auto 0;
  color: #7a6551;
  line-height: 1.75;
  font-size: 1rem;
}

.features-grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.feature-card {
  position: relative;
  overflow: hidden;
  padding: 30px 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(217, 165, 116, 0.14);
  box-shadow: 0 14px 40px rgba(115, 87, 56, 0.08);
  backdrop-filter: blur(10px);
  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: auto -20% -60% auto;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: rgba(217, 165, 116, 0.08);
  filter: blur(8px);
  transition: transform 0.35s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 45px rgba(115, 87, 56, 0.14);
  border-color: rgba(217, 165, 116, 0.28);
}

.feature-card:hover::before {
  transform: scale(1.15);
}

.icon-wrap {
  width: 64px;
  height: 64px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  font-size: 1.7rem;
  background: linear-gradient(135deg, #f4dec0 0%, #e8bc89 100%);
  box-shadow: 0 10px 22px rgba(217, 165, 116, 0.22);
}

.feature-card h3 {
  margin: 0 0 12px;
  color: #5f4530;
  font-size: 1.3rem;
}

.feature-card p {
  margin: 0;
  color: #7d6651;
  line-height: 1.7;
}

/* CTA */
.cta-section {
  padding: 10px 24px 90px;
  background: #f5f0e6;
}

.cta-box {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  overflow: hidden;
  padding: 52px 28px;
  border-radius: 32px;
  text-align: center;
  background: linear-gradient(135deg, #fff8f1 0%, #f0e2d2 100%);
  border: 1px solid rgba(217, 165, 116, 0.18);
  box-shadow: 0 18px 50px rgba(108, 81, 53, 0.09);
}

.cta-glow {
  position: absolute;
  top: -40px;
  right: -30px;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  background: rgba(217, 165, 116, 0.18);
  filter: blur(28px);
  animation: pulseGlow 4s ease-in-out infinite;
}

/* ENTRADA */
.fade-up {
  opacity: 0;
  transform: translateY(28px);
  animation: fadeUp 0.9s ease forwards;
}

.delay-1 {
  animation-delay: 0.15s;
}

.delay-2 {
  animation-delay: 0.35s;
}

.delay-3 {
  animation-delay: 0.55s;
}

.delay-4 {
  animation-delay: 0.75s;
}

/* KEYFRAMES */
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatSoft {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes slowZoom {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.08);
  }
}

@keyframes blobFloat {
  0% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-14px) translateX(10px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
}

@keyframes pulseGlow {
  0% {
    transform: scale(1);
    opacity: 0.55;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.85;
  }
  100% {
    transform: scale(1);
    opacity: 0.55;
  }
}

@keyframes loaderPop {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spinSoft {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes scrollDot {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(0);
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(16px);
  }
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .hero-content {
    max-width: 760px;
    padding: 32px 20px;
  }

  .hero-content h1 {
    font-size: clamp(2.2rem, 6vw, 4.3rem);
  }

  .hero-content p {
    max-width: 640px;
    font-size: 1.02rem;
    line-height: 1.7;
  }

  .features-grid {
    grid-template-columns: 1fr;
    max-width: 760px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 20px 16px;
    align-items: center;
  }

  .hero-content {
    width: 100%;
    padding: 20px 8px;
  }

  .brand {
    margin-bottom: 18px;
    padding: 9px 14px;
  }

  .brand-name {
    font-size: 14px;
    letter-spacing: 0.06em;
  }

  .hero-content h1 {
    font-size: clamp(2rem, 9vw, 3.2rem);
    line-height: 1.12;
  }

  .hero-content p {
    margin-top: 20px;
    font-size: 0.98rem;
    line-height: 1.65;
    padding: 0 6px;
  }

  .hero-actions {
    margin-top: 28px;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .btn {
    width: 100%;
    max-width: 320px;
    min-width: unset;
    padding: 14px 20px;
    font-size: 15px;
  }

  .features {
    padding: 72px 18px;
  }

  .cta-section {
    padding: 6px 18px 72px;
  }

  .cta-box {
    padding: 40px 20px;
    border-radius: 24px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 16px 12px;
  }

  .hero-content h1 {
    font-size: clamp(1.8rem, 10vw, 2.7rem);
  }

  .hero-content p {
    font-size: 0.93rem;
  }

  .brand {
    gap: 8px;
    padding: 8px 12px;
  }

  .brand-logo {
    font-size: 16px;
  }

  .brand-name {
    font-size: 13px;
  }

  .btn {
    max-width: 100%;
    border-radius: 14px;
  }

  .feature-card {
    padding: 24px 20px;
    border-radius: 20px;
  }

  .icon-wrap {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }

  .loader-content {
    width: 90vw;
  }
}
</style>