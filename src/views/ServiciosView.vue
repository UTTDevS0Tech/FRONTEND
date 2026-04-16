<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useApiCliente } from '@/composables/useApiCliente'


//tipo servicio (Apa)
interface Servicio {
  id: number
  nombre: string
  activo: number
  created_at: string | null
  updated_at: string | null
}


//tipo servicio hijo
interface TipoServicio {
  id: number
  nombre: string
  descripcion: string
  imagen: string | null
  activo: number
  precio: number
  tiempo_estimado: number
  servicio_id: number
}


//este ya es servicio + tipos
interface ServicioConTipos extends Servicio {
  tipos: TipoServicio[]
}


//lista base
const servicios = ref<Servicio[]>([])

//lista de tipos
const tiposServicio = ref<TipoServicio[]>([])


//carga
const cargando = ref(false)

//error 
const error = ref('')


//trae servicios
function obtenerServicios(callback?: () => void) {
  const { data, onFetchResponse, onFetchError } = useApiCliente('/servicios')
    .get()
    .json()

  onFetchResponse(() => {
    servicios.value = data.value?.data || []

    //ejecuta callback si existe (para sincronizar)
    callback?.()
  })

  onFetchError((err) => {
    console.error('Error al obtener servicios:', err)
    error.value = 'No se pudieron cargar los servicios.'

    callback?.()
  })
}


//trae tipos de servicio
function obtenerTiposServicio(callback?: () => void) {
  const { data, onFetchResponse, onFetchError } = useApiCliente('/tipo-servicios')
    .get()
    .json()

  onFetchResponse(() => {
    tiposServicio.value = data.value?.data || []

    callback?.()
  })

  onFetchError((err) => {
    console.error('Error al obtener tipo-servicios:', err)
    error.value = 'No se pudieron cargar los detalles de los servicios.'

    callback?.()
  })
}


//arma los servicios con sus tipos
const serviciosAgrupados = computed<ServicioConTipos[]>(() => {
  return servicios.value
    //solo servicios activos
    .filter((servicio) => servicio.activo === 1)

    //transformamos cada servicio
    .map((servicio) => ({
      ...servicio,

      //le metemos sus tipos relacionados
      tipos: tiposServicio.value.filter(
        (tipo) =>
          tipo.servicio_id === servicio.id && tipo.activo === 1
      ),
    }))
})


//cuando carga el componente
onMounted(() => {
  cargando.value = true
  error.value = ''

  //contador pa saber cuándo terminaron ambas peticiones
  let completadas = 0

  const finalizarCarga = () => {
    completadas++

    //cuando ya terminaron las 2 (servicios + tipos)
    if (completadas === 2) {
      cargando.value = false
    }
  }

  //dispara ambas peticiones
  obtenerServicios(finalizarCarga)
  obtenerTiposServicio(finalizarCarga)
})
</script>

<template>
  <main class="servicios-page">
    <div class="page-gradient"></div>
    <div class="page-pattern"></div>
    <div class="page-glow glow-1"></div>
    <div class="page-glow glow-2"></div>

    <section class="hero-strip">
      <div class="hero-copy">
        <span class="panel-tag">Cliente</span>
        <h1>Servicios</h1>
        <p>
          Explora nuestras áreas principales y conoce los servicios específicos
          disponibles en cada una.
        </p>
      </div>

      <div class="hero-stats">
        <article class="stat-card">
          <strong>{{ serviciosAgrupados.length }}</strong>
          <span>Categorías activas</span>
        </article>

        <article class="stat-card">
          <strong>{{ tiposServicio.filter((tipo) => tipo.activo === 1).length }}</strong>
          <span>Servicios disponibles</span>
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
        <h2>Catálogo de servicios</h2>
        <p>
          Revisa cada categoría y descubre los servicios que tenemos para ti.
        </p>
      </div>

      <div v-if="cargando" class="empty-state">
        <div class="loader"></div>
        <p>Cargando servicios...</p>
      </div>

      <div v-else-if="error" class="empty-state error-state">
        <h3>No se pudieron cargar los servicios</h3>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="!serviciosAgrupados.length" class="empty-state">
        <h3>No hay servicios disponibles</h3>
        <p>Pronto podrás consultar aquí nuestros servicios actualizados.</p>
      </div>

      <div v-else class="servicios-stack">
        <section
          v-for="servicio in serviciosAgrupados"
          :key="servicio.id"
          class="servicio-card"
        >
          <div class="card-glow"></div>

          <div class="servicio-header">
            <div>
              <h3>{{ servicio.nombre }}</h3>
              <p>
                {{ servicio.tipos.length }}
                {{ servicio.tipos.length === 1 ? 'servicio disponible' : 'servicios disponibles' }}
              </p>
            </div>
          </div>

          <div v-if="servicio.tipos.length" class="tipos-grid">
            <article
              v-for="tipo in servicio.tipos"
              :key="tipo.id"
              class="tipo-card"
            >
              <div class="tipo-top">
                <h4>{{ tipo.nombre }}</h4>
                <span class="precio-badge">${{ tipo.precio }}</span>
              </div>

              <p class="tipo-descripcion">
                {{ tipo.descripcion }}
              </p>

              <div class="tipo-meta">
                <span>{{ tipo.tiempo_estimado }} min</span>
              </div>
            </article>
          </div>

          <div v-else class="empty-category">
            <p>No hay servicios específicos disponibles en esta categoría por el momento.</p>
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

.servicios-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(204, 213, 174, 0.95), transparent 22%),
    radial-gradient(circle at 85% 20%, rgba(233, 237, 201, 0.7), transparent 20%),
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
  transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  background: rgba(204, 213, 174, 0.55);
  color: #556246;
  border: 1px solid rgba(169, 184, 130, 0.2);
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.06);
  backdrop-filter: blur(8px);
}

.back-btn:hover {
  transform: translateY(-2px);
  background: rgba(204, 213, 174, 0.78);
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

.servicios-stack {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.servicio-card,
.empty-state {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.07);
  backdrop-filter: blur(12px);
}

.servicio-card {
  position: relative;
  overflow: hidden;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
}

.servicio-card:hover {
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

.servicio-header h3 {
  margin: 0 0 6px;
  color: #5f4b3a;
  font-size: 1.5rem;
}

.servicio-header p {
  margin: 0;
  color: #6d7d55;
  font-weight: 800;
}

.tipos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.tipo-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(233, 237, 201, 0.34) 0%, rgba(250, 237, 205, 0.22) 100%);
  border: 1px solid rgba(204, 213, 174, 0.24);
  backdrop-filter: blur(8px);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.tipo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 24px rgba(92, 75, 59, 0.08);
  border-color: rgba(169, 184, 130, 0.26);
}

.tipo-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.tipo-top h4 {
  margin: 0;
  color: #5f4b3a;
  font-size: 1.05rem;
}

.precio-badge {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.16);
  color: #8d633c;
  font-weight: 800;
}

.tipo-descripcion {
  margin: 0;
  color: #7b6a58;
  line-height: 1.65;
}

.tipo-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tipo-meta span {
  display: inline-flex;
  align-items: center;
  padding: 7px 11px;
  border-radius: 999px;
  background: rgba(204, 213, 174, 0.42);
  color: #5f6f4f;
  font-size: 0.88rem;
  font-weight: 800;
}

.empty-state {
  padding: 36px 18px;
  text-align: center;
}

.empty-state h3 {
  color: #5f4b3a;
  margin: 0 0 8px;
}

.empty-state p,
.empty-category p {
  color: #8a7764;
  margin: 0;
}

.error-state {
  background: rgba(255, 244, 244, 0.6);
}

.empty-category {
  padding: 8px 4px 2px;
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
  .servicios-page {
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

  .servicio-card,
  .empty-state {
    padding: 18px;
    border-radius: 22px;
  }

  .page-header h2 {
    font-size: 1.5rem;
  }
}
</style>