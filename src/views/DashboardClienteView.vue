<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <main class="client-home">
    <header class="top-nav">
      <div class="brand">Estética Nova</div>

      <nav class="nav-links">
        <a href="#">Home</a>
        <a href="#">Estilistas</a>
        <a href="#">Servicios</a>
        <a href="#">Perfil</a>
      </nav>
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
        <button class="hero-btn">Agendar cita</button>
      </div>
    </section>

    <section class="gallery">
      <div class="section-head">
        <span>Nuestra Galería</span>
        <h2>Momentos y espacios</h2>
      </div>

      <div class="gallery-grid">
        <div class="gallery-card">
          <img src="@/assets/galeria1.jpg" alt="Galería 1" />
        </div>
        <div class="gallery-card">
          <img src="@/assets/galeria2.jpg" alt="Galería 2" />
        </div>
        <div class="gallery-card">
          <img src="@/assets/galeria3.jpg" alt="Galería 3" />
        </div>
      </div>
    </section>

    <footer class="about-bar">
      <div>
        <h3>Sobre Nosotros</h3>
        <p>Un espacio dedicado al cuidado personal, la belleza y el bienestar.</p>
      </div>

      <div>
        <h4>Dirección</h4>
        <p>Av. Principal 123, Tu Ciudad</p>
      </div>

      <div>
        <h4>Contacto</h4>
        <p>Tel. 000 000 0000</p>
        <p>correo@estetica.com</p>
      </div>
    </footer>
  </main>
</template>

<style scoped>
.client-home {
  min-height: 100vh;
  background: #FEFAE0;
  color: #5f4b3a;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background: rgba(254, 250, 224, 0.95);
  border-bottom: 1px solid rgba(212, 163, 115, 0.15);
  position: sticky;
  top: 0;
  z-index: 20;
}

.brand {
  font-size: 1.35rem;
  font-weight: 800;
  color: #D4A373;
}

.nav-links {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.nav-links a {
  color: #5f4b3a;
  text-decoration: none;
  font-weight: 700;
}

.hero {
  position: relative;
  min-height: 72vh;
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
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(95, 75, 58, 0.58),
    rgba(95, 75, 58, 0.22)
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  width: min(900px, 100%);
  padding: 2rem;
  text-align: center;
  color: white;
}

.hero-badge {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-weight: 700;
}

.hero-content h1 {
  margin: 0 auto 1rem;
  max-width: 760px;
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.08;
}

.hero-content p {
  max-width: 680px;
  margin: 0 auto 1.5rem;
  line-height: 1.8;
  font-size: 1rem;
}

.hero-btn {
  border: none;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  background: #D4A373;
  color: white;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 16px 30px rgba(212, 163, 115, 0.28);
}

.gallery {
  padding: 4rem 2rem;
  background: #FEFAE0;
}

.section-head {
  text-align: center;
  margin-bottom: 2rem;
}

.section-head span {
  color: #D4A373;
  font-weight: 700;
}

.section-head h2 {
  margin: 0.5rem 0 0;
  font-size: 2rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.gallery-card {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 30px rgba(92, 75, 59, 0.12);
  min-height: 280px;
  background: #FAEDCD;
}

.gallery-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-bar {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  background: #CCD5AE;
  color: #5f4b3a;
}

.about-bar h3,
.about-bar h4 {
  margin-top: 0;
}

.about-bar p {
  margin: 0.35rem 0;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .top-nav {
    flex-direction: column;
    gap: 1rem;
  }

  .gallery-grid,
  .about-bar {
    grid-template-columns: 1fr;
  }

  .hero {
    min-height: 60vh;
  }
}
</style>