<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePersonalCitasStore } from '@/stores/estilistaCita'
import EstilistaCitas from '@/components/EstilistaCitas.vue'

const router = useRouter()
const store = usePersonalCitasStore()

const totalPendientes = computed(() =>
  store.citas.filter((c) => c.estado === 'pendiente').length
)

const totalConfirmadas = computed(() =>
  store.citas.filter((c) => c.estado === 'confirmada').length
)
</script>

<template>
  <main class="agenda-page">
    <section class="agenda-shell">
      <div class="agenda-layout">
        
        <!-- SIDEBAR -->
        <aside class="agenda-sidebar">
          <span class="panel-tag">Personal</span>
          <h1>Mi agenda</h1>
          <p>
            Consulta tus citas programadas y organiza tu jornada fácilmente.
          </p>

          <div class="sidebar-stats">
            <div class="stat-card">
              <strong>{{ store.citas.length }}</strong>
              <span>Total de citas</span>
            </div>

            <div class="stat-card">
              <strong>{{ totalPendientes }}</strong>
              <span>Pendientes</span>
            </div>

            <div class="stat-card">
              <strong>{{ totalConfirmadas }}</strong>
              <span>Confirmadas</span>
            </div>
          </div>
        </aside>

        <!-- CONTENIDO -->
        <section class="agenda-main">
          
          <!-- BOTÓN -->
          <div class="top-actions">
            <button
              class="back-btn"
              @click="router.push('/dashboard/personal')"
            >
              ← Volver al dashboard
            </button>
          </div>

          <!-- HEADER -->
          <div class="page-header">
            <h2>Agenda de trabajo</h2>
            <p>Visualiza tus citas asignadas y su estado.</p>
          </div>

          <!-- CARD -->
          <div class="content-card">
            <EstilistaCitas />
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

.agenda-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 22px;
  background: linear-gradient(135deg, #fefae0, #faedcd, #e9edc9);
}

.agenda-shell {
  width: min(1600px, 100%);
}

.agenda-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  border-radius: 30px;
  overflow: hidden;
  background: rgba(255,255,255,0.6);
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}

/* SIDEBAR */
.agenda-sidebar {
  padding: 30px;
  background: linear-gradient(#ccd5ae, #e9edc9);
}

.panel-tag {
  background: rgba(255,255,255,0.4);
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: bold;
}

.agenda-sidebar h1 {
  margin: 15px 0;
  color: #5f4b3a;
}

.sidebar-stats {
  margin-top: 20px;
  display: grid;
  gap: 15px;
}

.stat-card {
  background: rgba(255,255,255,0.5);
  padding: 15px;
  border-radius: 15px;
}

.stat-card strong {
  font-size: 1.5rem;
}

/* MAIN */
.agenda-main {
  padding: 25px;
  background: rgba(254,250,224,0.9);
}

.top-actions {
  margin-bottom: 10px;
}

.back-btn {
  background: #ccd5ae;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}

.page-header h2 {
  margin: 0;
  color: #5f4b3a;
}

.content-card {
  margin-top: 15px;
  padding: 20px;
  border-radius: 25px;
  background: rgba(255,255,255,0.6);
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .agenda-layout {
    grid-template-columns: 1fr;
  }
}
</style>