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
  <main class="galeria-publica-page">
    <section class="galeria-hero">
      <span class="hero-badge">Estética Nova</span>
      <h1>Galería de trabajos</h1>
      <p>
        Explora algunos de nuestros estilos, acabados y resultados en distintas
        categorías de belleza.
      </p>
    </section>

    <section class="galeria-shell">
      <div v-if="cargando" class="loading-state">
        <div class="loader"></div>
        <p>Cargando galería...</p>
      </div>

      <div v-else-if="error" class="mensaje-error">
        {{ error }}
      </div>

      <div v-else-if="!categorias.length" class="empty-state">
        <h3>Aún no hay contenido en la galería</h3>
        <p>Pronto podrás ver aquí nuestros trabajos más recientes.</p>
      </div>

      <section
        v-else
        v-for="categoria in categorias"
        :key="categoria.id"
        class="categoria-section"
      >
        <div class="categoria-header">
          <div>
            <h2>{{ categoria.nombre }}</h2>
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
              <h3>{{ imagen.titulo }}</h3>
            </div>
          </article>
        </div>

        <div v-else class="empty-category">
          <p>No hay imágenes disponibles en esta categoría por el momento.</p>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.galeria-publica-page {
  min-height: 100vh;
  padding: 32px 20px 56px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 55%, #e9edc9 100%);
}

.galeria-hero {
  width: min(1100px, 100%);
  margin: 0 auto 28px;
  text-align: center;
  padding: 32px 20px 12px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  color: #8d633c;
  font-weight: 800;
  font-size: 0.9rem;
  box-shadow: 0 10px 22px rgba(92, 75, 59, 0.08);
}

.galeria-hero h1 {
  margin: 18px 0 12px;
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  line-height: 1.05;
  color: #5f4b3a;
}

.galeria-hero p {
  width: min(720px, 100%);
  margin: 0 auto;
  color: #7b6a58;
  font-size: 1rem;
  line-height: 1.75;
}

.galeria-shell {
  width: min(1280px, 100%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.categoria-section {
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.52);
  border-radius: 30px;
  padding: 24px;
  box-shadow: 0 18px 40px rgba(92, 75, 59, 0.1);
  backdrop-filter: blur(12px);
}

.categoria-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin-bottom: 18px;
}

.categoria-header h2 {
  margin: 0 0 6px;
  color: #5f4b3a;
  font-size: 1.8rem;
}

.categoria-header p {
  margin: 0;
  color: #8a7764;
  font-weight: 700;
}

.galeria-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
}

.imagen-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.imagen-frame {
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 24px;
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

.imagen-info {
  padding: 0 4px;
}

.imagen-info h3 {
  margin: 0;
  color: #5f4b3a;
  font-size: 1rem;
  font-weight: 800;
}

.sin-imagen {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #8a7764;
  font-weight: 700;
}

.loading-state,
.empty-state,
.empty-category {
  text-align: center;
  padding: 28px 12px;
}

.loading-state p,
.empty-state p,
.empty-category p {
  margin: 12px 0 0;
  color: #8a7764;
}

.empty-state h3 {
  margin: 0 0 8px;
  color: #5f4b3a;
}

.mensaje-error {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 228, 228, 0.9);
  color: #a14444;
  border: 1px solid rgba(161, 68, 68, 0.14);
  font-weight: 700;
}

.loader {
  width: 42px;
  height: 42px;
  margin: 0 auto;
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

@media (max-width: 768px) {
  .galeria-publica-page {
    padding: 22px 14px 40px;
  }

  .categoria-section {
    padding: 18px;
    border-radius: 24px;
  }

  .categoria-header h2 {
    font-size: 1.45rem;
  }

  .galeria-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .galeria-grid {
    grid-template-columns: 1fr;
  }
}
</style>