<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CitasClienteForm from '@/components/CitasForm.vue'
import { useCitaStore } from '@/stores/cita'

const router = useRouter()
const citaStore = useCitaStore()

const totalServicios = computed(
  () => citaStore.serviciosData?.data?.length || 0
)

const totalPersonales = computed(
  () => citaStore.personalData?.data?.length || 0
)
</script>

<template>
  <main class="citas-page">
    <section class="citas-shell">
      <div class="citas-layout">
        <aside class="citas-sidebar">
          <span class="panel-tag">Cliente</span>
          <h1>Agenda tu cita</h1>
          <p>
            Selecciona tu estilista, elige tu horario y arma tu cita con los
            servicios que prefieras.
          </p>

          <div class="sidebar-stats">
            <div class="stat-card">
              <strong>{{ totalPersonales }}</strong>
              <span>Estilistas disponibles</span>
            </div>

            <div class="stat-card">
              <strong>{{ totalServicios }}</strong>
              <span>Servicios disponibles</span>
            </div>

            <div class="stat-card">
              <strong>3</strong>
              <span>Máximo de servicios por cita</span>
            </div>
          </div>
        </aside>

        <section class="citas-content">
          <div class="top-actions">
            <button type="button" class="back-btn" @click="router.push('/dashboard/cliente')">
              ← Volver a la página principal
            </button>
          </div>

          <div class="header">
            <h2>Nueva cita</h2>
            <p>Completa la información para reservar tu espacio.</p>
          </div>

          <div class="card form-card">
            <div class="card-header">
              <h3>Formulario de cita</h3>
              <span>Captura los datos necesarios</span>
            </div>

            <CitasClienteForm />
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

.citas-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 22px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
  color: #5f4b3a;
}

.citas-shell {
  width: min(1680px, 100%);
  animation: pageEnter 0.8s ease;
}

.citas-layout {
  display: grid;
  grid-template-columns: 270px 1fr;
  min-height: 780px;
  border-radius: 30px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.56);
  border: 1px solid rgba(255, 255, 255, 0.52);
  box-shadow: 0 22px 60px rgba(92, 75, 59, 0.14);
  backdrop-filter: blur(16px);
}

.citas-sidebar {
  padding: 34px 24px;
  background: linear-gradient(180deg, #ccd5ae 0%, #e9edc9 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.panel-tag {
  display: inline-block;
  width: fit-content;
  margin-bottom: 24px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.42);
  color: #6d5844;
  font-weight: 800;
  font-size: 0.95rem;
}

.citas-sidebar h1 {
  margin: 0 0 16px;
  font-size: 2.3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.citas-sidebar p {
  margin: 0 0 24px;
  color: #7b6a58;
  line-height: 1.7;
  font-size: 0.95rem;
}

.sidebar-stats {
  display: grid;
  gap: 18px;
  margin-top: 12px;
}

.stat-card {
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.45);
  box-shadow: 0 10px 24px rgba(92, 75, 59, 0.08);
}

.stat-card strong {
  display: block;
  margin-bottom: 8px;
  font-size: 1.8rem;
  color: #5f4b3a;
}

.stat-card span {
  color: #7b6a58;
  font-weight: 600;
}

.citas-content {
  padding: 24px 28px;
  background: rgba(254, 250, 224, 0.88);
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.top-actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.back-btn {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
  background: rgba(204, 213, 174, 0.55);
  color: #5f4b3a;
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.08);
}

.back-btn:hover {
  transform: translateY(-2px);
  background: rgba(204, 213, 174, 0.78);
  box-shadow: 0 14px 24px rgba(92, 75, 59, 0.12);
}

.header {
  display: grid;
  gap: 0.35rem;
}

.header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #5f4b3a;
}

.header p {
  margin: 0;
  color: #8a7764;
  font-size: 0.95rem;
}

.card {
  background: rgba(255, 255, 255, 0.62);
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
  border: 1px solid rgba(236, 231, 216, 0.7);
}

.form-card {
  min-height: 620px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.card-header h3 {
  margin: 0;
  font-size: 1.35rem;
  color: #5f4b3a;
}

.card-header span {
  color: #8a7764;
  font-weight: 700;
  font-size: 0.95rem;
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

@media (max-width: 1250px) {
  .citas-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .citas-page {
    padding: 1rem;
  }

  .card {
    padding: 1rem;
  }

  .header h2 {
    font-size: 1.5rem;
  }
}
</style>  