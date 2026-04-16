<script setup lang="ts">
</script>

<template>
  <main class="landing-page">
    <section class="hero">
      <div class="hero-background"></div>
      <div class="hero-overlay"></div>
      <div class="hero-glow glow-top"></div>
      <div class="hero-glow glow-bottom"></div>
      <div class="hero-grid"></div>

      <div class="hero-shell">
        <div class="hero-copy">
          <div class="brand-badge fade-up delay-1">
            <span class="brand-logo">✦</span>
            <span class="brand-name">Estética Nova</span>
          </div>

          <div class="hero-text">
            <p class="eyebrow fade-up delay-2">Belleza, cuidado y confianza</p>

            <h1 class="fade-up delay-3">
              Tu espacio para
              <span>consentirte</span>,
              renovarte y
              verte increíble
            </h1>

            <p class="hero-description fade-up delay-4">
              Agenda tus servicios de forma fácil, conoce nuestro equipo
              y vive una experiencia pensada para tu bienestar, comodidad
              y estilo en cada visita.
            </p>
          </div>

          <div class="hero-actions fade-up delay-5">
            <router-link to="/login" class="btn btn-primary">
              ¿Ya eres cliente? Inicia sesión
            </router-link>

            <router-link to="/register" class="btn btn-secondary">
              Registrarse
            </router-link>
          </div>
        </div>

        <div class="hero-panel fade-up delay-4">
          <div class="panel-card panel-main">
            <span class="panel-label">Experiencia</span>
            <h2>Un lugar pensado para que te sientas bien desde que llegas.</h2>
            <p>
              Descubre nuestros servicios, encuentra a tu estilista ideal
              y organiza tus citas con una experiencia visual clara, cálida
              y moderna.
            </p>
          </div>

          <div class="panel-stats">
            <article class="stat-card">
              <span class="stat-number">+Estilo</span>
              <span class="stat-text">Servicios y atención pensados para cada cliente.</span>
            </article>

            <article class="stat-card">
              <span class="stat-number">+Comodidad</span>
              <span class="stat-text">Una experiencia simple para reservar y explorar.</span>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  background:
    linear-gradient(180deg, #f6f0e7 0%, #efe5d8 100%);
  color: #fff;
  overflow-x: hidden;
}

/* HERO */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 32px;
  overflow: hidden;
  isolation: isolate;
}

.hero-background {
  position: absolute;
  inset: 0;
  background-image: url('@/assets/banner-principal.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: slowZoom 20s ease-in-out infinite alternate;
  transform: scale(1);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      115deg,
      rgba(35, 28, 18, 0.72) 0%,
      rgba(53, 42, 26, 0.52) 35%,
      rgba(91, 73, 48, 0.28) 100%
    ),
    linear-gradient(
      to top,
      rgba(24, 18, 12, 0.52) 0%,
      rgba(24, 18, 12, 0.16) 45%,
      rgba(24, 18, 12, 0.18) 100%
    );
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.65), transparent 80%);
  opacity: 0.22;
  pointer-events: none;
}

.hero-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(24px);
  pointer-events: none;
  z-index: 0;
}

.glow-top {
  top: 8%;
  left: 4%;
  width: 240px;
  height: 240px;
  background: rgba(232, 197, 151, 0.22);
  animation: floatBlob 12s ease-in-out infinite;
}

.glow-bottom {
  right: 6%;
  bottom: 10%;
  width: 320px;
  height: 320px;
  background: rgba(175, 214, 153, 0.18);
  animation: floatBlob 15s ease-in-out infinite reverse;
}

.hero-shell {
  position: relative;
  z-index: 1;
  width: min(1320px, 100%);
  min-height: calc(100vh - 64px);
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  align-items: center;
  gap: 28px;
}

.hero-copy {
  max-width: 760px;
  padding: 24px 0;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 248, 240, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.14);
}

.brand-logo {
  font-size: 18px;
}

.brand-name {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-text {
  max-width: 760px;
}

.eyebrow {
  margin: 0 0 14px;
  color: rgba(255, 242, 228, 0.9);
  font-size: 0.94rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-text h1 {
  margin: 0;
  font-size: clamp(2.8rem, 6vw, 5.7rem);
  line-height: 1.02;
  font-weight: 300;
  letter-spacing: -0.03em;
  text-shadow: 0 14px 38px rgba(0, 0, 0, 0.22);
}

.hero-text h1 span {
  color: #f4d2aa;
}

.hero-description {
  max-width: 680px;
  margin: 26px 0 0;
  color: rgba(255, 250, 244, 0.92);
  font-size: 1.08rem;
  line-height: 1.85;
  text-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 34px;
}

.hero-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
  justify-self: end;
  width: min(100%, 430px);
}

.panel-card,
.stat-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 249, 241, 0.12);
  backdrop-filter: blur(16px);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.14);
}

.panel-card::before,
.stat-card::before {
  content: '';
  position: absolute;
  inset: auto -20% -55% auto;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: rgba(255, 219, 180, 0.14);
  filter: blur(8px);
}

.panel-main {
  border-radius: 28px;
  padding: 28px 24px;
}

.panel-label {
  display: inline-flex;
  margin-bottom: 16px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #fff4e8;
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.panel-main h2 {
  margin: 0;
  font-size: 1.55rem;
  line-height: 1.25;
  color: #fffaf5;
  font-weight: 600;
}

.panel-main p {
  margin: 14px 0 0;
  color: rgba(255, 247, 239, 0.84);
  line-height: 1.8;
  font-size: 0.98rem;
}

.panel-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-card {
  min-height: 150px;
  border-radius: 22px;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-number {
  color: #f5d1a7;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 0.01em;
}

.stat-text {
  color: rgba(255, 247, 239, 0.84);
  line-height: 1.65;
  font-size: 0.94rem;
}

.scroll-indicator {
  position: absolute;
  left: 50%;
  bottom: 28px;
  z-index: 1;
  transform: translateX(-50%);
}

.scroll-indicator span {
  position: relative;
  width: 30px;
  height: 52px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.62);
  display: inline-block;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
}

.scroll-indicator span::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  width: 6px;
  height: 10px;
  border-radius: 999px;
  background: #fff;
  transform: translateX(-50%);
  animation: scrollDot 1.8s ease-in-out infinite;
}

/* BUTTONS */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 220px;
  min-height: 56px;
  padding: 15px 24px;
  border-radius: 18px;
  text-decoration: none;
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.2;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease,
    opacity 0.25s ease;
}

.btn:hover {
  transform: translateY(-4px);
}

.btn:active {
  transform: translateY(-1px);
}

.btn-primary {
  color: #fff;
  background: linear-gradient(135deg, #d9a574 0%, #c9925d 100%);
  box-shadow: 0 14px 34px rgba(201, 146, 93, 0.34);
}

.btn-primary:hover {
  box-shadow: 0 18px 38px rgba(201, 146, 93, 0.42);
}

.btn-secondary {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.26);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.36);
}

.btn-ghost {
  color: #7b5b3d;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(123, 91, 61, 0.14);
  box-shadow: 0 12px 24px rgba(123, 91, 61, 0.08);
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.92);
}

/* SECTIONS */
.features-section {
  position: relative;
  padding: 110px 32px 90px;
  background:
    radial-gradient(circle at top left, rgba(217, 165, 116, 0.12), transparent 28%),
    radial-gradient(circle at right center, rgba(177, 205, 157, 0.18), transparent 24%),
    linear-gradient(180deg, #f6f0e7 0%, #efe4d8 100%);
}

.section-header {
  max-width: 780px;
  margin: 0 auto 48px;
  text-align: center;
}

.section-pill {
  display: inline-flex;
  margin-bottom: 16px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(217, 165, 116, 0.14);
  color: #8b6541;
  font-size: 0.9rem;
  font-weight: 700;
}

.section-pill.soft {
  background: rgba(255, 255, 255, 0.18);
  color: #fff6ec;
}

.section-header h2,
.cta-content h2 {
  margin: 0;
  color: #5f4530;
  font-size: clamp(2rem, 4vw, 3.3rem);
  line-height: 1.12;
}

.section-header p,
.cta-content p {
  margin: 18px auto 0;
  max-width: 720px;
  color: #7a6551;
  font-size: 1rem;
  line-height: 1.8;
}

.features-grid {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.feature-card {
  position: relative;
  overflow: hidden;
  padding: 28px 24px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(217, 165, 116, 0.14);
  box-shadow: 0 16px 42px rgba(115, 87, 56, 0.08);
  backdrop-filter: blur(12px);
  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

.feature-card::before {
  content: '';
  position: absolute;
  right: -40px;
  bottom: -60px;
  width: 170px;
  height: 170px;
  border-radius: 999px;
  background: rgba(217, 165, 116, 0.08);
  filter: blur(8px);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 22px 46px rgba(115, 87, 56, 0.14);
  border-color: rgba(217, 165, 116, 0.26);
}

.feature-icon {
  width: 62px;
  height: 62px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  font-size: 1.4rem;
  color: #6c4d31;
  background: linear-gradient(135deg, #f4dec0 0%, #e8bc89 100%);
  box-shadow: 0 12px 24px rgba(217, 165, 116, 0.22);
}

.feature-card h3 {
  margin: 0 0 12px;
  color: #5f4530;
  font-size: 1.25rem;
}

.feature-card p {
  margin: 0;
  color: #7d6651;
  line-height: 1.75;
}

/* CTA */
.cta-section {
  padding: 0 32px 100px;
  background: linear-gradient(180deg, #efe4d8 0%, #f5ede2 100%);
}

.cta-card {
  position: relative;
  width: min(1180px, 100%);
  margin: 0 auto;
  overflow: hidden;
  border-radius: 34px;
  padding: 56px 32px;
  background:
    linear-gradient(135deg, rgba(109, 137, 90, 0.92) 0%, rgba(141, 169, 118, 0.85) 100%);
  box-shadow: 0 22px 54px rgba(92, 78, 58, 0.14);
}

.cta-glow {
  position: absolute;
  top: -40px;
  right: -10px;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  background: rgba(255, 236, 205, 0.24);
  filter: blur(26px);
  animation: pulseGlow 5s ease-in-out infinite;
}

.cta-content {
  position: relative;
  z-index: 1;
  max-width: 760px;
}

.cta-content h2 {
  color: #fffdf9;
}

.cta-content p {
  color: rgba(255, 248, 241, 0.88);
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 30px;
}

/* ENTRANCE */
.fade-up {
  opacity: 0;
  transform: translateY(26px);
  animation: fadeUp 0.9s ease forwards;
}

.delay-1 {
  animation-delay: 0.12s;
}

.delay-2 {
  animation-delay: 0.24s;
}

.delay-3 {
  animation-delay: 0.36s;
}

.delay-4 {
  animation-delay: 0.5s;
}

.delay-5 {
  animation-delay: 0.66s;
}

/* KEYFRAMES */
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
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

@keyframes floatBlob {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(12px, -16px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes pulseGlow {
  0% {
    transform: scale(1);
    opacity: 0.55;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 0.55;
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
@media (max-width: 1180px) {
  .hero-shell {
    grid-template-columns: 1fr;
    gap: 22px;
    align-content: center;
    padding-top: 36px;
    padding-bottom: 64px;
  }

  .hero-copy {
    max-width: 820px;
  }

  .hero-panel {
    justify-self: start;
    width: min(100%, 760px);
  }

  .panel-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .features-grid {
    grid-template-columns: 1fr;
    max-width: 760px;
  }
}

@media (max-width: 768px) {
  .hero,
  .features-section,
  .cta-section {
    padding-left: 18px;
    padding-right: 18px;
  }

  .hero {
    min-height: 100vh;
    padding-top: 20px;
    padding-bottom: 24px;
  }

  .hero-shell {
    min-height: auto;
    gap: 18px;
  }

  .hero-copy {
    padding: 10px 0 0;
  }

  .brand-badge {
    margin-bottom: 18px;
    padding: 9px 14px;
  }

  .brand-name {
    font-size: 0.84rem;
  }

  .eyebrow {
    margin-bottom: 12px;
    font-size: 0.82rem;
  }

  .hero-text h1 {
    font-size: clamp(2.2rem, 10vw, 3.7rem);
    line-height: 1.08;
  }

  .hero-description {
    margin-top: 18px;
    font-size: 0.98rem;
    line-height: 1.75;
  }

  .hero-actions,
  .cta-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
    min-width: unset;
  }

  .hero-panel {
    width: 100%;
  }

  .panel-main {
    padding: 22px 18px;
    border-radius: 24px;
  }

  .panel-main h2 {
    font-size: 1.28rem;
  }

  .panel-main p {
    font-size: 0.94rem;
  }

  .panel-stats {
    grid-template-columns: 1fr;
  }

  .stat-card {
    min-height: 132px;
  }

  .features-section {
    padding-top: 88px;
    padding-bottom: 72px;
  }

  .section-header {
    margin-bottom: 34px;
  }

  .section-header p,
  .cta-content p {
    font-size: 0.97rem;
  }

  .cta-section {
    padding-bottom: 78px;
  }

  .cta-card {
    padding: 40px 20px;
    border-radius: 26px;
  }

  .scroll-indicator {
    bottom: 16px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding-left: 14px;
    padding-right: 14px;
  }

  .hero-text h1 {
    font-size: clamp(2rem, 11vw, 3rem);
  }

  .hero-description {
    font-size: 0.93rem;
    line-height: 1.7;
  }

  .brand-badge {
    gap: 8px;
    padding: 8px 12px;
  }

  .brand-logo {
    font-size: 16px;
  }

  .brand-name {
    font-size: 0.8rem;
  }

  .panel-label,
  .section-pill {
    font-size: 0.8rem;
  }

  .feature-card {
    padding: 24px 18px;
    border-radius: 22px;
  }

  .feature-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
  }

  .cta-card {
    padding: 34px 18px;
  }
}
</style>