<script setup lang="ts">
</script>

<template>
  <main class="landing-page">
    <section class="hero">
      <div class="bg-zoom"></div>
      <div class="overlay"></div>

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
    linear-gradient(to bottom, rgba(20, 16, 10, 0.25), rgba(20, 16, 10, 0.45)),
    rgba(68, 56, 34, 0.18);
  backdrop-filter: blur(1.5px);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
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
  font-size: clamp(2.4rem, 6vw, 5.2rem);
  line-height: 1.08;
  font-weight: 300;
  text-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
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
    opacity 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
  will-change: transform;
}

.btn:hover {
  transform: translateY(-4px) scale(1.02);
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

/* Animaciones de entrada */
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

/* Tablet */
@media (max-width: 1024px) {
  .hero-content {
    max-width: 760px;
    padding: 32px 20px;
  }

  .hero-content h1 {
    font-size: clamp(2.2rem, 6vw, 4.2rem);
  }

  .hero-content p {
    max-width: 640px;
    font-size: 1.02rem;
    line-height: 1.7;
  }
}

/* Celular */
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
}

/* Cel muy pequeño */
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
}
</style>s