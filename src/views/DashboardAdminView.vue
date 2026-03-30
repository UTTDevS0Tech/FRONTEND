<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <main class="profile-page">
    <section class="profile-shell">
      <div class="profile-card">
        <div class="profile-left">
          <span class="panel-tag">Panel de Administración</span>

          <div class="avatar-wrap">
            <img src="@/assets/profile.jpg" alt="Foto de perfil" />
          </div>

          <h1>Administrador</h1>
          <p>
            Bienvenido de nuevo. Desde aquí puedes gestionar al equipo y administrar los servicios disponibles dentro de Estética Nova.
          </p>
        </div>

        <div class="profile-right">
          <div class="right-header">
            <h2>Accesos rápidos</h2>
            <span>Gestiona el sistema con facilidad</span>
          </div>
          <button class="action-card" @click="$router.push('/dashboard/admin/servicios')">
            <strong>Crear Servicio</strong>
            <span>Agrega nuevos servicios al catálogo de la estética.</span>
          </button>
          <button class="action-card secondary">
            <strong>Crear Estilista</strong>
            <span>Registra personal nuevo y amplía tu equipo de trabajo.</span>
          </button>
        </div>
        
      </div>
    </section>
  </main>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #FEFAE0 0%, #FAEDCD 60%, #E9EDC9 100%);
}

.profile-shell {
  width: min(1380px, 100%);
}

.profile-card {
  display: grid;
  grid-template-columns: 420px 1fr;
  min-height: 760px;
  border-radius: 34px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 26px 70px rgba(92, 75, 59, 0.16);
  backdrop-filter: blur(16px);
  animation: riseIn 0.8s ease;
}

.profile-left {
  padding: 50px 36px;
  text-align: center;
  background: linear-gradient(180deg, #CCD5AE 0%, #E9EDC9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.panel-tag {
  display: inline-block;
  margin-bottom: 24px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255,255,255,0.4);
  color: #6d5844;
  font-weight: 800;
}

.avatar-wrap {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  overflow: hidden;
  border: 6px solid rgba(255,255,255,0.78);
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

.profile-left h1 {
  margin: 0 0 14px;
  font-size: 2.5rem;
  color: #5f4b3a;
}

.profile-left p {
  margin: 0;
  max-width: 290px;
  color: #7b6a58;
  line-height: 1.9;
  font-size: 1.02rem;
}

.profile-right {
  padding: 58px;
  background: rgba(254, 250, 224, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.right-header {
  margin-bottom: 30px;
}

.right-header h2 {
  margin: 0 0 8px;
  font-size: 2.4rem;
  color: #5f4b3a;
}

.right-header span {
  color: #8a7764;
  font-size: 1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  gap: 24px;
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
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 26px 40px rgba(212, 163, 115, 0.32);
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
</style>