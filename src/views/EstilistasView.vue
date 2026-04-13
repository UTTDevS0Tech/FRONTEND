<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useApiCliente } from '@/composables/useApiCliente'

interface HorarioEstilista {
  dia: string
  inicio: string
  fin: string
  activo: boolean
}

interface Estilista {
  id: number
  nombre: string
  descripcion: string
  user_id: number
  horarios: HorarioEstilista[]
}

const estilistas = ref<Estilista[]>([])
const cargando = ref(false)
const error = ref('')

function formatearHora(hora: string) {
  return hora.slice(0, 5)
}

function obtenerHorariosActivos(horarios: HorarioEstilista[]) {
  return horarios.filter((horario) => horario.activo)
}

function resumenDisponibilidad(horarios: HorarioEstilista[]) {
  const activos = obtenerHorariosActivos(horarios)

  if (!activos.length) {
    return 'Sin horarios disponibles'
  }

  const primerHorario = activos[0]
    if (!primerHorario) {
    return 'Sin horarios disponibles'
    }
    
  const todosIguales = activos.every(
    (horario) =>
      horario.inicio === primerHorario.inicio &&
      horario.fin === primerHorario.fin
  )

  if (todosIguales) {
    return `${activos.length} días disponibles · ${formatearHora(primerHorario.inicio)} - ${formatearHora(primerHorario.fin)}`
  }

  return `${activos.length} días disponibles`
}

function obtenerEstilistas() {
  const { data, onFetchResponse, onFetchError } = useApiCliente('/estilistas')
    .get()
    .json()

  onFetchResponse(() => {
    estilistas.value = data.value?.data || []
    cargando.value = false
  })

  onFetchError((err) => {
    console.error('Error al obtener estilistas:', err)
    error.value = 'No se pudieron cargar los estilistas.'
    cargando.value = false
  })
}

const totalHorariosActivos = computed(() =>
  estilistas.value.reduce(
    (acc, estilista) => acc + obtenerHorariosActivos(estilista.horarios).length,
    0
  )
)

onMounted(() => {
  cargando.value = true
  error.value = ''
  obtenerEstilistas()
})
</script>

<template>
  <main class="estilistas-page">
    <section class="estilistas-shell">
      <div class="estilistas-layout">
        <aside class="estilistas-sidebar">
          <span class="panel-tag">Cliente</span>
          <h1>Estilistas</h1>
          <p>
            Conoce al equipo que hará de tu visita una experiencia especial.
            Descubre su estilo de trabajo y sus horarios disponibles.
          </p>

          <div class="sidebar-stats">
            <div class="stat-card">
              <strong>{{ estilistas.length }}</strong>
              <span>Estilistas disponibles</span>
            </div>

            <div class="stat-card">
              <strong>{{ totalHorariosActivos }}</strong>
              <span>Horarios activos registrados</span>
            </div>
          </div>
        </aside>

        <section class="estilistas-content">
          <div class="top-actions">
            <router-link to="/dashboard/cliente" class="back-btn">
              ← Volver a la página principal
            </router-link>
          </div>

          <div class="page-header">
            <h2>Nuestro equipo</h2>
            <p>
              Explora la información de cada estilista y revisa su disponibilidad semanal.
            </p>
          </div>

          <div v-if="cargando" class="empty-state">
            <div class="loader"></div>
            <p>Cargando estilistas...</p>
          </div>

          <div v-else-if="error" class="empty-state error-state">
            <h3>No se pudieron cargar los estilistas</h3>
            <p>{{ error }}</p>
          </div>

          <div v-else-if="!estilistas.length" class="empty-state">
            <h3>No hay estilistas disponibles</h3>
            <p>Pronto podrás consultar aquí al equipo de la estética.</p>
          </div>

          <div v-else class="estilistas-grid">
            <article
              v-for="estilista in estilistas"
              :key="estilista.id"
              class="estilista-card"
            >
              <div class="estilista-top">
                <div class="avatar-circle">
                  {{ estilista.nombre.charAt(0).toUpperCase() }}
                </div>

                <div class="estilista-copy">
                  <h3>{{ estilista.nombre }}</h3>
                  <p class="disponibilidad-texto">
                    {{ resumenDisponibilidad(estilista.horarios) }}
                  </p>
                </div>
              </div>

              <p class="descripcion">
                {{ estilista.descripcion || 'Sin descripción disponible.' }}
              </p>

              <div class="horarios-card">
                <h4>Horarios disponibles</h4>

                <div
                  v-if="obtenerHorariosActivos(estilista.horarios).length"
                  class="horarios-lista"
                >
                  <div
                    v-for="horario in obtenerHorariosActivos(estilista.horarios)"
                    :key="`${estilista.id}-${horario.dia}`"
                    class="horario-item"
                  >
                    <span class="dia">{{ horario.dia }}</span>
                    <strong>
                      {{ formatearHora(horario.inicio) }} - {{ formatearHora(horario.fin) }}
                    </strong>
                  </div>
                </div>

                <p v-else class="sin-horarios">
                  Este estilista no tiene horarios activos por el momento.
                </p>
              </div>
            </article>
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

.estilistas-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 22px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
  color: #5f4b3a;
}

.estilistas-shell {
  width: min(1680px, 100%);
  animation: pageEnter 0.8s ease;
}

.estilistas-layout {
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

.estilistas-sidebar {
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

.estilistas-sidebar h1 {
  margin: 0 0 16px;
  font-size: 2.3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.estilistas-sidebar p {
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

.estilistas-content {
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
  text-decoration: none;
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

.page-header {
  display: grid;
  gap: 0.35rem;
}

.page-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #5f4b3a;
}

.page-header p {
  margin: 0;
  color: #8a7764;
  font-size: 0.95rem;
}

.estilistas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
}

.estilista-card,
.empty-state {
  background: rgba(255, 255, 255, 0.62);
  border-radius: 28px;
  border: 1px solid rgba(236, 231, 216, 0.7);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
}

.estilista-card {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.estilista-top {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar-circle {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #d4a373, #bf8c5a);
  color: white;
  font-size: 1.4rem;
  font-weight: 900;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.25);
  flex-shrink: 0;
}

.estilista-copy h3 {
  margin: 0 0 5px;
  color: #5f4b3a;
  font-size: 1.2rem;
}

.disponibilidad-texto {
  margin: 0;
  color: #8a7764;
  font-weight: 700;
  font-size: 0.92rem;
}

.descripcion {
  margin: 0;
  color: #7b6a58;
  line-height: 1.7;
}

.horarios-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 22px;
  background: rgba(250, 237, 205, 0.45);
  border: 1px solid rgba(212, 163, 115, 0.14);
}

.horarios-card h4 {
  margin: 0;
  color: #5f4b3a;
  font-size: 1rem;
}

.horarios-lista {
  display: grid;
  gap: 10px;
}

.horario-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.78);
  color: #5f4b3a;
}

.horario-item .dia {
  font-weight: 700;
}

.sin-horarios {
  margin: 0;
  color: #8a7764;
}

.empty-state {
  padding: 36px 18px;
  text-align: center;
}

.empty-state h3 {
  color: #5f4b3a;
  margin: 0 0 8px;
}

.empty-state p {
  color: #8a7764;
  margin: 0;
}

.error-state {
  background: rgba(255, 244, 244, 0.9);
}

.loader {
  width: 42px;
  height: 42px;
  margin: 0 auto 12px;
  border: 4px solid rgba(212, 163, 115, 0.2);
  border-top-color: #d4a373;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
  .estilistas-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .estilistas-page {
    padding: 16px;
  }

  .estilistas-content {
    padding: 18px;
  }

  .estilista-card,
  .empty-state {
    padding: 18px;
    border-radius: 22px;
  }

  .estilista-top {
    align-items: flex-start;
  }

  .horario-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header h2 {
    font-size: 1.5rem;
  }
}
</style>