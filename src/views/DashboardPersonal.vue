<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <main class="profile-page">
    <section class="profile-card">
      <div class="top-bar">
        <span>Recepción</span>
      </div>

      <div class="profile-header">
        <div class="avatar">
          <img src="@/assets/profile.jpg" alt="Foto de perfil" />
        </div>
        <h1>Personal</h1>
        <p>ya va a cambiar entre recepcionista y estilista pero x mientras usare el de recep ok?</p>
      </div>

      <div class="actions">
        <button class="action-card">Crear Cita de Escritorio</button>
        <button class="action-card action-secondary">Ver Citas Pendientes</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background: linear-gradient(180deg, #FEFAE0 0%, #FAEDCD 100%);
}

.profile-card {
  width: min(420px, 100%);
  background: #E9EDC9;
  border: 6px solid #D4A373;
  border-radius: 36px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(92, 75, 59, 0.16);
}

.top-bar {
  background: #D4A373;
  color: white;
  text-align: center;
  padding: 1rem;
  font-weight: 700;
}

.profile-header {
  padding: 2rem 1.5rem 1.25rem;
  text-align: center;
  background: linear-gradient(180deg, #CCD5AE 0%, #E9EDC9 100%);
}

.avatar {
  width: 110px;
  height: 110px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid rgba(255, 255, 255, 0.8);
  background: white;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-header h1 {
  margin: 0;
  color: #5f4b3a;
  font-size: 1.8rem;
}

.profile-header p {
  margin: 0.75rem auto 0;
  max-width: 280px;
  color: #7b6a58;
  line-height: 1.6;
}

.actions {
  padding: 1.4rem;
  display: grid;
  gap: 1rem;
  background: #FEFAE0;
}

.action-card {
  min-height: 84px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #D4A373, #c89361);
  color: white;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 12px 22px rgba(212, 163, 115, 0.22);
}

.action-secondary {
  background: linear-gradient(135deg, #CCD5AE, #b7c290);
  color: #5f4b3a;
}
</style>