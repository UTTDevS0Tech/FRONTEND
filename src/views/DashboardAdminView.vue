<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function cerrarSesion() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <main class="dashboard-page">
    <div class="page-gradient"></div>
    <div class="page-pattern"></div>
    <div class="page-glow glow-1"></div>
    <div class="page-glow glow-2"></div>

    <section class="hero-strip">
      <div class="hero-copy">
        <span class="panel-tag">Panel de Administración</span>
        <h1>Bienvenid@</h1>
        <p>
          Gestiona los módulos principales del sistema desde una vista más clara,
          moderna y cómoda para tu flujo administrativo.
        </p>
      </div>

      <div class="hero-stats">
        <article class="stat-card">
          <strong>Admin</strong>
          <span>Control central del sistema Nova</span>
        </article>
      </div>
    </section>

    <section class="content-area">
      <div class="top-actions">
        <button class="logout-btn" @click="cerrarSesion">
          <img src="@/assets/cerrarssesion.svg" alt="" aria-hidden="true" class="btn-icon" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      <div class="dashboard-layout">
        <aside class="profile-left">
          <span class="panel-badge">Administración</span>

          <div class="avatar-wrap">
            <img src="@/assets/profile.jpg" alt="Foto de perfil" />
          </div>

          <h2>Administrador</h2>
          <p>
            Bienvenido de nuevo. Desde aquí puedes gestionar al equipo y
            administrar los servicios disponibles dentro de Estética Nova.
          </p>
        </aside>

        <section class="profile-right">
          <div class="right-header">
            <span class="section-tag">Accesos rápidos</span>
            <h3>Acciones disponibles</h3>
            <p>Gestiona el sistema con facilidad desde herramientas directas.</p>
          </div>

          <div class="actions-grid">
            <button class="action-card" @click="$router.push('/dashboard/admin/servicios')">
              <strong>Administrar Servicios</strong>
              <span>Agrega nuevos servicios al catálogo de la estética.</span>
            </button>

            <button class="action-card" @click="$router.push('/dashboard/admin/tipos-servicio')">
              <strong>Administrar Tipos de servicio</strong>
              <span>Administra los tipos de servicio disponibles.</span>
            </button>

            <button class="action-card secondary" @click="$router.push('/dashboard/admin/personal')">
              <strong>Administrar Personal</strong>
              <span>Administra personal nuevo y amplía tu equipo de trabajo.</span>
            </button>

            <button class="action-card secondary" @click="$router.push('/dashboard/admin/galeria')">
              <strong>Administrar Galería</strong>
              <span>Gestiona las imágenes que se mostrarán en la galería principal.</span>
            </button>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.dashboard-page {
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
  font-size: 1.9rem;
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
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.72rem;
  border: none;
  border-radius: 14px;
  padding: 12px 18px;
  background: rgba(255, 226, 226, 0.95);
  color: #a14444;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(161, 68, 68, 0.1);
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

.dashboard-layout {
  display: grid;
  grid-template-columns: minmax(320px, 0.78fr) minmax(0, 1.22fr);
  gap: 22px;
  align-items: stretch;
}

.profile-left,
.profile-right {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.07);
  backdrop-filter: blur(12px);
}

.profile-left {
  padding: 38px 28px;
  text-align: center;
  background: linear-gradient(180deg, rgba(204, 213, 174, 0.5) 0%, rgba(233, 237, 201, 0.3) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.panel-badge {
  display: inline-block;
  margin-bottom: 24px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.42);
  color: #6d5844;
  font-weight: 800;
  font-size: 0.95rem;
}

.avatar-wrap {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  overflow: hidden;
  border: 6px solid rgba(255, 255, 255, 0.78);
  box-shadow: 0 18px 30px rgba(92, 75, 59, 0.12);
  margin-bottom: 24px;
  transition: transform 0.3s ease;
}

.avatar-wrap:hover {
  transform: scale(1.03);
}

.avatar-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-left h2 {
  margin: 0 0 14px;
  font-size: 2.3rem;
  color: #5f4b3a;
}

.profile-left p {
  margin: 0;
  max-width: 340px;
  color: #7b6a58;
  line-height: 1.85;
  font-size: 1rem;
}

.profile-right {
  padding: 34px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.right-header {
  margin-bottom: 26px;
}

.section-tag {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.16);
  color: #8d633c;
  font-size: 0.82rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.right-header h3 {
  margin: 0 0 8px;
  font-size: 2.2rem;
  color: #5f4b3a;
}

.right-header p {
  margin: 0;
  color: #8a7764;
  font-size: 1rem;
  line-height: 1.7;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  gap: 22px;
}

.action-card {
  min-height: 220px;
  padding: 28px;
  border: none;
  border-radius: 26px;
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 18px 30px rgba(212, 163, 115, 0.24);
  transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 26px 40px rgba(212, 163, 115, 0.32);
  filter: brightness(1.02);
}

.action-card.secondary {
  background: linear-gradient(135deg, #CCD5AE, #b5c08e);
  color: #5f4b3a;
}

.action-card strong {
  display: block;
  font-size: 1.45rem;
  margin-bottom: 14px;
}

.action-card span {
  line-height: 1.8;
  font-size: 1rem;
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

@media (max-width: 1180px) {
  .hero-strip {
    grid-template-columns: 1fr;
  }

  .dashboard-layout {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 900px) {
  .content-area,
  .hero-strip {
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

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .profile-left,
  .profile-right {
    border-radius: 22px;
  }

  .profile-right,
  .profile-left {
    padding: 22px 18px;
  }
}

@media (max-width: 640px) {
  .logout-btn {
    width: 100%;
  }

  .top-actions {
    justify-content: stretch;
  }

  .profile-left h2 {
    font-size: 2rem;
  }

  .right-header h3 {
    font-size: 1.8rem;
  }

  .action-card {
    min-height: 190px;
    padding: 22px;
    border-radius: 22px;
  }
}
</style>