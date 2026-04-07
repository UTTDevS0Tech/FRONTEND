<script setup lang="ts">
</script>

<template>
  <main class="landing-page">
    <section class="hero">
      <div class="overlay"></div>

      <div class="hero-content">
        <div class="brand">
          <span class="brand-logo">✦</span>
          <span class="brand-name">Estética Nova</span>
        </div>

        <span class="badge">Bienvenida</span>

        <h1>
          Tu espacio para
          <br />
          consentirte, renovarte
          <br />
          y verte increíble
        </h1>

        <p>
          Agenda tus servicios de forma fácil, conoce nuestro equipo
          y vive una experiencia pensada para tu bienestar.
        </p>

        <div class="hero-actions">
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
}

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-image: url('@/assets/spa-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(68, 56, 34, 0.32);
  backdrop-filter: blur(1px);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  text-align: center;
  color: #fff;
  padding: 40px 24px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 248, 240, 0.2);
  backdrop-filter: blur(6px);
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

.badge {
  display: inline-block;
  margin-bottom: 22px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  font-size: 14px;
  font-weight: 600;
}

.hero-content h1 {
  margin: 0;
  font-size: clamp(2.6rem, 6vw, 5rem);
  line-height: 1.08;
  font-weight: 300;
}

.hero-content p {
  max-width: 720px;
  margin: 28px auto 0;
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.95);
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
  padding: 14px 24px;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  font-size: 15px;
  transition: transform 0.2s ease, opacity 0.2s ease, background 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: #d9a574;
  color: white;
}

.btn-primary:hover {
  background: #c9925d;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.18);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(5px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.28);
}

@media (max-width: 768px) {
  .hero {
    padding: 20px;
  }

  .hero-content {
    padding: 24px 12px;
  }

  .hero-content p {
    font-size: 1rem;
    line-height: 1.6;
  }

  .btn {
    width: 100%;
    max-width: 320px;
  }
}
</style>