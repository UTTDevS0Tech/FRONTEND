<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useApiGaleria } from '@/composables/useApiGaleria'

interface ImagenGaleria {
  id: number
  titulo: string
  imagen: string
  imagen_url: string | null
  categoria_id: number | null
  created_at?: string
  updated_at?: string
}

interface CategoriaGaleria {
  id: number
  nombre: string
  imagenes: ImagenGaleria[]
}

const categorias = ref<CategoriaGaleria[]>([])
const cargando = ref(false)
const error = ref('')

function obtenerGaleriaPublica() {
  cargando.value = true
  error.value = ''

  const { data, onFetchResponse, onFetchError } = useApiGaleria('/galeria/publica')
    .get()
    .json()

  onFetchResponse(() => {
    categorias.value = data.value?.data || []
    cargando.value = false
  })

  onFetchError((err) => {
    console.error('Error al obtener galería pública:', err)
    error.value = 'No se pudo cargar la galería.'
    cargando.value = false
  })
}

onMounted(() => {
  obtenerGaleriaPublica()
})
</script>

<template>
  <main class="galeria-page">
    <section class="galeria-shell">
      <div class="galeria-layout">
        <aside class="galeria-sidebar">
          <span class="panel-tag">Cliente</span>
          <h1>Galería</h1>
          <p>
            Explora algunos de nuestros trabajos más recientes organizados por categoría.
            Inspírate y conoce un poco más de lo que podemos hacer por ti.
          </p>

          <div class="sidebar-stats">
            <div class="stat-card">
              <strong>{{ categorias.length }}</strong>
              <span>Categorías disponibles</span>
            </div>
          </div>
        </aside>

        <section class="galeria-content">
          <div class="top-actions">
            <router-link to="/dashboard/cliente" class="back-btn">
              ← Volver a la página principal
            </router-link>
          </div>

          <div class="page-header">
            <h2>Galería de inspiración</h2>
            <p>Descubre estilos, acabados y resultados en cada una de nuestras categorías.</p>
          </div>

          <div v-if="cargando" class="empty-state">
            <div class="loader"></div>
            <p>Cargando galería...</p>
          </div>

          <div v-else-if="error" class="empty-state error-state">
            <h3>No se pudo cargar la galería</h3>
            <p>{{ error }}</p>
          </div>

          <div v-else-if="!categorias.length" class="empty-state">
            <h3>Aún no hay categorías disponibles</h3>
            <p>Pronto podrás ver aquí nuestros trabajos más recientes.</p>
          </div>

          <div v-else class="categorias-stack">
            <section
              v-for="categoria in categorias"
              :key="categoria.id"
              class="categoria-card"
            >
              <div class="categoria-header">
                <div>
                  <h3>{{ categoria.nombre }}</h3>
                  <p>
                    {{ categoria.imagenes.length }}
                    {{ categoria.imagenes.length === 1 ? 'imagen' : 'imágenes' }}
                  </p>
                </div>
              </div>

              <div v-if="categoria.imagenes.length" class="galeria-grid">
                <article
                  v-for="imagen in categoria.imagenes"
                  :key="imagen.id"
                  class="imagen-card"
                >
                  <div class="imagen-frame">
                    <img
                      v-if="imagen.imagen_url"
                      :src="imagen.imagen_url"
                      :alt="imagen.titulo"
                    />
                    <div v-else class="sin-imagen">Sin imagen</div>
                  </div>

                  <div class="imagen-info">
                    <h4>{{ imagen.titulo }}</h4>
                  </div>
                </article>
              </div>

              <div v-else class="empty-category">
                <p>No hay imágenes disponibles en esta categoría por el momento.</p>
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

.galeria-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 22px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
  color: #5f4b3a;
}

.galeria-shell {
  width: min(1680px, 100%);
  animation: pageEnter 0.8s ease;
}

.galeria-layout {
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

.galeria-sidebar {
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

.galeria-sidebar h1 {
  margin: 0 0 16px;
  font-size: 2.3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.galeria-sidebar p {
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

.galeria-content {
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

.categorias-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.categoria-card,
.empty-state {
  background: rgba(255, 255, 255, 0.62);
  border-radius: 28px;
  border: 1px solid rgba(236, 231, 216, 0.7);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
}

.categoria-card {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.categoria-header h3 {
  margin: 0 0 6px;
  color: #5f4b3a;
  font-size: 1.4rem;
}

.categoria-header p {
  margin: 0;
  color: #8a7764;
  font-weight: 700;
}

.galeria-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.imagen-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.imagen-frame {
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 22px;
  overflow: hidden;
  background: rgba(250, 237, 205, 0.8);
  box-shadow: 0 12px 24px rgba(92, 75, 59, 0.08);
}

.imagen-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.imagen-card:hover .imagen-frame img {
  transform: scale(1.03);
}

.imagen-info h4 {
  margin: 0;
  color: #5f4b3a;
  font-size: 1rem;
}

.sin-imagen {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #8a7764;
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
  .galeria-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .galeria-page {
    padding: 16px;
  }

  .galeria-content {
    padding: 18px;
  }

  .categoria-card,
  .empty-state {
    padding: 18px;
    border-radius: 22px;
  }

  .page-header h2 {
    font-size: 1.5rem;
  }
}
</style>