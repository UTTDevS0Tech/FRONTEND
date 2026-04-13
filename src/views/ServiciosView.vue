<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useApiCliente } from '@/composables/useApiCliente'

interface Servicio {
  id: number
  nombre: string
  activo: number
  created_at: string | null
  updated_at: string | null
}

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

interface ServicioConTipos extends Servicio {
  tipos: TipoServicio[]
}

const servicios = ref<Servicio[]>([])
const tiposServicio = ref<TipoServicio[]>([])

const cargando = ref(false)
const error = ref('')

function obtenerServicios(callback?: () => void) {
  const { data, onFetchResponse, onFetchError } = useApiCliente('/servicios')
    .get()
    .json()

  onFetchResponse(() => {
    servicios.value = data.value?.data || []
    callback?.()
  })

  onFetchError((err) => {
    console.error('Error al obtener servicios:', err)
    error.value = 'No se pudieron cargar los servicios.'
    callback?.()
  })
}

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

const serviciosAgrupados = computed<ServicioConTipos[]>(() => {
  return servicios.value
    .filter((servicio) => servicio.activo === 1)
    .map((servicio) => ({
      ...servicio,
      tipos: tiposServicio.value.filter(
        (tipo) => tipo.servicio_id === servicio.id && tipo.activo === 1
      ),
    }))
})

onMounted(() => {
  cargando.value = true
  error.value = ''

  let completadas = 0

  const finalizarCarga = () => {
    completadas++
    if (completadas === 2) {
      cargando.value = false
    }
  }

  obtenerServicios(finalizarCarga)
  obtenerTiposServicio(finalizarCarga)
})
</script>

<template>
  <main class="servicios-page">
    <section class="servicios-shell">
      <div class="servicios-layout">
        <aside class="servicios-sidebar">
          <span class="panel-tag">Cliente</span>
          <h1>Servicios</h1>
          <p>
            Explora nuestras áreas principales y conoce los servicios específicos
            disponibles en cada una.
          </p>
        </aside>

        <section class="servicios-content">
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
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.servicios-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 22px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
  color: #5f4b3a;
}

.servicios-shell {
  width: min(1680px, 100%);
  animation: pageEnter 0.8s ease;
}

.servicios-layout {
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

.servicios-sidebar {
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

.servicios-sidebar h1 {
  margin: 0 0 16px;
  font-size: 2.3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.servicios-sidebar p {
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

.servicios-content {
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

.servicios-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.servicio-card,
.empty-state {
  background: rgba(255, 255, 255, 0.62);
  border-radius: 28px;
  border: 1px solid rgba(236, 231, 216, 0.7);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
}

.servicio-card {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.servicio-header h3 {
  margin: 0 0 6px;
  color: #5f4b3a;
  font-size: 1.45rem;
}

.servicio-header p {
  margin: 0;
  color: #8a7764;
  font-weight: 700;
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
  background: rgba(250, 237, 205, 0.45);
  border: 1px solid rgba(212, 163, 115, 0.14);
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
  line-height: 1.6;
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
  color: #5f4b3a;
  font-size: 0.88rem;
  font-weight: 700;
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
  background: rgba(255, 244, 244, 0.9);
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

@media (max-width: 1250px) {
  .servicios-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .servicios-page {
    padding: 16px;
  }

  .servicios-content {
    padding: 18px;
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