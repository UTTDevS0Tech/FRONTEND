<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { Servicio, TipoServicio } from '@/types'

const props = defineProps<{
  modelValue?: TipoServicio | null
  servicios: Servicio[]
  cargando?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: FormData): void
  (e: 'cancel'): void
}>()

const formulario = reactive({
  nombre: '',
  descripcion: '',
  precio: 0,
  tiempo_estimado: 1,
  activo: true,
  servicio_id: 0,
  imagen: null as File | null
})

const editando = computed(() => !!props.modelValue?.id)

watch(
  () => props.modelValue,
  (valor) => {
    formulario.nombre = valor?.nombre ?? ''
    formulario.descripcion = valor?.descripcion ?? ''
    formulario.precio = valor?.precio ?? 0
    formulario.tiempo_estimado = valor?.tiempo_estimado ?? 1
    formulario.activo = valor?.activo ?? true
    formulario.servicio_id = valor?.servicio_id ?? 0
    formulario.imagen = null
  },
  { immediate: true }
)

function limpiarFormulario() {
  formulario.nombre = ''
  formulario.descripcion = ''
  formulario.precio = 0
  formulario.tiempo_estimado = 1
  formulario.activo = true
  formulario.servicio_id = 0
  formulario.imagen = null

  emit('cancel')
}

function manejarArchivo(event: Event) {
  const input = event.target as HTMLInputElement
  formulario.imagen = input.files?.[0] ?? null
}

function guardarTipoServicio() {
  const formData = new FormData()

  formData.append('nombre', formulario.nombre)
  formData.append('descripcion', formulario.descripcion)
  formData.append('precio', String(formulario.precio))
  formData.append('tiempo_estimado', String(formulario.tiempo_estimado))
  formData.append('activo', formulario.activo ? '1' : '0')
  formData.append('servicio_id', String(formulario.servicio_id))

  if (formulario.imagen) {
    formData.append('imagen', formulario.imagen)
  }

  emit('submit', formData)
}
</script>

<template>
  <main class="tipos-page">
    <section class="tipos-shell">
      <div class="tipos-layout">
        <aside class="tipos-sidebar">
          <span class="panel-tag">Administración</span>
          <h1>Tipos de Servicio</h1>
          <p>
            Gestiona los tipos de servicio de la estética. Aquí puedes registrar
            variantes específicas, asignarlas a un servicio base y definir su
            precio, duración e imagen.
          </p>

          <div class="sidebar-stats">
            <div class="stat-card">
              <strong>{{ servicios.length }}</strong>
              <span>Servicios base disponibles</span>
            </div>

            <div class="stat-card">
              <strong>{{ editando ? 'Edición' : 'Nuevo' }}</strong>
              <span>Modo actual del formulario</span>
            </div>
          </div>
        </aside>

        <section class="tipos-content">
          <div class="tipos-header">
            <div>
              <h2>{{ editando ? 'Editar tipo de servicio' : 'Crear tipo de servicio' }}</h2>
              <p>Completa el formulario para registrar un nuevo tipo de servicio.</p>
            </div>
          </div>

          <div class="tipos-grid">
            <div class="tipos-panel formulario-panel">
              <h3>{{ editando ? 'Formulario de edición' : 'Nuevo tipo de servicio' }}</h3>

              <form class="tipo-form" @submit.prevent="guardarTipoServicio">
                <div class="form-group">
                  <label>Nombre del tipo de servicio</label>
                  <input
                    v-model="formulario.nombre"
                    type="text"
                    placeholder="Ej. Corte premium"
                    required
                  />
                </div>

                <div class="form-group">
                  <label>Descripción</label>
                  <textarea
                    v-model="formulario.descripcion"
                    rows="4"
                    placeholder="Describe este tipo de servicio"
                  />
                </div>

                <div class="form-group">
                  <label>Servicio base</label>
                  <select v-model.number="formulario.servicio_id" required>
                    <option :value="0" disabled>Selecciona un servicio</option>
                    <option
                      v-for="servicio in servicios"
                      :key="servicio.id"
                      :value="servicio.id"
                    >
                      {{ servicio.nombre }}
                    </option>
                  </select>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Precio</label>
                    <input
                      v-model.number="formulario.precio"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Ej. 250"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label>Tiempo estimado (min)</label>
                    <input
                      v-model.number="formulario.tiempo_estimado"
                      type="number"
                      min="1"
                      placeholder="Ej. 60"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    @change="manejarArchivo"
                  />
                </div>

                <div class="form-group check-group">
                  <label class="checkbox-wrap">
                    <input
                      v-model="formulario.activo"
                      type="checkbox"
                    />
                    <span>Tipo de servicio activo</span>
                  </label>
                </div>

                <div class="acciones-formulario">
                  <button type="submit" :disabled="cargando">
                    {{ editando ? 'Actualizar tipo de servicio' : 'Crear tipo de servicio' }}
                  </button>

                  <button
                    type="button"
                    class="secondary"
                    :disabled="cargando"
                    @click="limpiarFormulario"
                  >
                    Limpiar
                  </button>
                </div>
              </form>
            </div>

            <div class="tipos-panel info-panel">
              <div class="info-card">
                <h3>Recomendaciones</h3>
                <ul class="tips-list">
                  <li>Usa nombres claros y fáciles de identificar.</li>
                  <li>Relaciona cada tipo con su servicio base correcto.</li>
                  <li>Define una duración estimada realista.</li>
                  <li>Agrega una imagen si quieres mejorar la presentación.</li>
                </ul>
              </div>

              <div class="info-card">
                <h3>Vista rápida</h3>
                <div class="preview-box">
                  <p><strong>Nombre:</strong> {{ formulario.nombre || 'Sin definir' }}</p>
                  <p><strong>Precio:</strong> {{ formulario.precio || 0 }}</p>
                  <p><strong>Tiempo:</strong> {{ formulario.tiempo_estimado || 0 }} min</p>
                  <p><strong>Estado:</strong> {{ formulario.activo ? 'Activo' : 'Inactivo' }}</p>
                </div>
              </div>
            </div>
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

.tipos-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #FEFAE0 0%, #FAEDCD 58%, #E9EDC9 100%);
}

.tipos-shell {
  width: min(1440px, 100%);
  animation: pageEnter 0.8s ease;
}

.tipos-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  min-height: 840px;
  border-radius: 34px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.56);
  border: 1px solid rgba(255, 255, 255, 0.52);
  box-shadow: 0 26px 70px rgba(92, 75, 59, 0.16);
  backdrop-filter: blur(16px);
}

.tipos-sidebar {
  padding: 50px 36px;
  background: linear-gradient(180deg, #CCD5AE 0%, #E9EDC9 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
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

.tipos-sidebar h1 {
  margin: 0 0 18px;
  font-size: 3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.tipos-sidebar p {
  margin: 0 0 28px;
  color: #7b6a58;
  line-height: 1.9;
  font-size: 1.03rem;
  max-width: 290px;
}

.sidebar-stats {
  display: grid;
  gap: 16px;
}

.stat-card {
  padding: 20px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.48);
  box-shadow: 0 10px 24px rgba(92, 75, 59, 0.08);
  transition: transform 0.25s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card strong {
  display: block;
  margin-bottom: 6px;
  font-size: 2rem;
  color: #5f4b3a;
}

.stat-card span {
  color: #7b6a58;
  font-weight: 600;
}

.tipos-content {
  padding: 42px;
  background: rgba(254, 250, 224, 0.88);
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.tipos-header h2 {
  margin: 0 0 8px;
  font-size: 2.5rem;
  color: #5f4b3a;
}

.tipos-header p {
  margin: 0;
  color: #8a7764;
  font-size: 1rem;
}

.tipos-grid {
  display: grid;
  grid-template-columns: minmax(520px, 1fr) 320px;
  gap: 22px;
}

.tipos-panel {
  background: rgba(255, 255, 255, 0.62);
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
}

.tipos-panel h3 {
  margin: 0 0 18px;
  font-size: 1.6rem;
  color: #5f4b3a;
}

.tipo-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  color: #5f4b3a;
  font-weight: 800;
}

input[type="text"],
input[type="number"],
select,
textarea,
input[type="file"] {
  padding: 14px 15px;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: rgba(255, 255, 255, 0.92);
  color: #5f4b3a;
  font-size: 1rem;
  outline: none;
  transition: 0.25s ease;
  font-family: inherit;
}

textarea {
  resize: vertical;
  min-height: 110px;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus,
textarea:focus,
input[type="file"]:focus {
  border-color: #D4A373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
  transform: translateY(-1px);
}

.check-group {
  flex-direction: row;
  align-items: center;
}

.checkbox-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #5f4b3a;
}

.checkbox-wrap input {
  width: 18px;
  height: 18px;
  accent-color: #D4A373;
}

.acciones-formulario {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  padding: 12px 16px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 800;
  transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.acciones-formulario button {
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.25);
}

.acciones-formulario button.secondary {
  background: linear-gradient(135deg, #CCD5AE, #b8c493);
  color: #5f4b3a;
  box-shadow: 0 14px 24px rgba(179, 192, 136, 0.22);
}

.info-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.info-card {
  padding: 22px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 10px 24px rgba(92, 75, 59, 0.06);
}

.info-card h3 {
  margin: 0 0 14px;
  font-size: 1.25rem;
}

.tips-list {
  margin: 0;
  padding-left: 18px;
  color: #7b6a58;
  line-height: 1.8;
}

.preview-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-box p {
  margin: 0;
  color: #6d5844;
  line-height: 1.6;
}

.preview-box strong {
  color: #5f4b3a;
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
</style>