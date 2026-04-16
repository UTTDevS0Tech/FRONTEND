<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useApiCliente } from '@/composables/useApiCliente'


//horario de estilista
interface HorarioEstilista {
  dia: string
  inicio: string
  fin: string
  activo: boolean
}


// estilista
interface Estilista {
  id: number
  nombre: string
  descripcion: string
  user_id: number
  horarios: HorarioEstilista[]
}


//lista de estilistas
const estilistas = ref<Estilista[]>([])

//estado de carga
const cargando = ref(false)

//mensaje de error
const error = ref('')


//esto solo recorta la hora ej: 08:00:00 a 08:00 pq no sirven los seg 
function formatearHora(hora: string) {
  return hora.slice(0, 5)
}


//filtra solo los horarios activos
function obtenerHorariosActivos(horarios: HorarioEstilista[]) {
  return horarios.filter((horario) => horario.activo)
}


//resumen de disponibilidad
function resumenDisponibilidad(horarios: HorarioEstilista[]) {
  const activos = obtenerHorariosActivos(horarios)

  //si no hay horarios activos
  if (!activos.length) {
    return 'Sin horarios disponibles'
  }

  //agarramos el primer horario de ref
  const primerHorario = activos[0]

  if (!primerHorario) {
    return 'Sin horarios disponibles'
  }

  //checa si todos tienen el mismo horario
  const todosIguales = activos.every(
    (horario) =>
      horario.inicio === primerHorario.inicio &&
      horario.fin === primerHorario.fin
  )

  //si smn da rango de horas y cantidad de días
  if (todosIguales) {
    return `${activos.length} días disponibles · ${formatearHora(primerHorario.inicio)} - ${formatearHora(primerHorario.fin)}`
  }

  //si no solo mostramos cuántos días hay
  return `${activos.length} días disponibles`
}


//trae los estilistas desde la API
function obtenerEstilistas() {
  const { data, onFetchResponse, onFetchError } = useApiCliente('/estilistas')
    .get()
    .json()

  onFetchResponse(() => {
    //guarda lista
    estilistas.value = data.value?.data || []

    cargando.value = false
  })

  onFetchError((err) => {
    console.error('Error al obtener estilistas:', err)
    error.value = 'No se pudieron cargar los estilistas.'

    cargando.value = false
  })
}


//esto calcula el total de horarios activos de TOOOOOOOODOS los estilistas
const totalHorariosActivos = computed(() =>
  estilistas.value.reduce(
    (acc, estilista) =>
      acc + obtenerHorariosActivos(estilista.horarios).length,
    0
  )
)


//cuando carga el componente
onMounted(() => {
  cargando.value = true
  error.value = ''

  obtenerEstilistas()
})
</script>

<template>
  <main class="estilistas-page">
    <div class="page-gradient"></div>
    <div class="page-pattern"></div>
    <div class="page-glow glow-1"></div>
    <div class="page-glow glow-2"></div>

    <section class="hero-strip">
      <div class="hero-copy">
        <span class="panel-tag">Cliente</span>
        <h1>Estilistas</h1>
        <p>
          Conoce al equipo que hará de tu visita una experiencia especial.
          Descubre su estilo de trabajo y sus horarios disponibles.
        </p>
      </div>

      <div class="hero-stats">
        <article class="stat-card">
          <strong>{{ estilistas.length }}</strong>
          <span>Estilistas registrados</span>
        </article>

        <article class="stat-card">
          <strong>{{ totalHorariosActivos }}</strong>
          <span>Horarios activos en total</span>
        </article>
      </div>
    </section>

    <section class="content-area">
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
          <div class="card-glow"></div>

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
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.estilistas-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(233, 237, 201, 0.95), transparent 24%),
    radial-gradient(circle at bottom right, rgba(212, 163, 115, 0.18), transparent 22%),
    linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
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
  background: rgba(204, 213, 174, 0.24);
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

.stat-card strong {
  display: block;
  margin-bottom: 8px;
  font-size: 2rem;
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
  background: rgba(204, 213, 174, 0.42);
  color: #5f4b3a;
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.06);
  backdrop-filter: blur(8px);
}

.back-btn:hover {
  transform: translateY(-2px);
  background: rgba(204, 213, 174, 0.65);
  box-shadow: 0 14px 24px rgba(92, 75, 59, 0.1);
}

.page-header {
  display: grid;
  gap: 0.35rem;
  margin-bottom: 4px;
}

.page-header h2 {
  margin: 0;
  font-size: 2rem;
  color: #5f4b3a;
}

.page-header p {
  margin: 0;
  color: #8a7764;
  font-size: 1rem;
  line-height: 1.7;
}

.estilistas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.estilista-card,
.empty-state {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.07);
  backdrop-filter: blur(12px);
}

.estilista-card {
  position: relative;
  overflow: hidden;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
}

.estilista-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 22px 38px rgba(92, 75, 59, 0.1);
  border-color: rgba(212, 163, 115, 0.22);
}

.card-glow {
  position: absolute;
  top: -36px;
  right: -20px;
  width: 120px;
  height: 120px;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.14);
  filter: blur(18px);
  pointer-events: none;
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
  line-height: 1.75;
}

.horarios-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 22px;
  background: rgba(250, 237, 205, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
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
  background: rgba(255, 255, 255, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.2);
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
  background: rgba(255, 244, 244, 0.6);
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

@media (max-width: 1080px) {
  .hero-strip {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .estilistas-page {
    padding: 0;
  }

  .hero-strip,
  .content-area {
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