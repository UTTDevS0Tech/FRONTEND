<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { AdminPersonal } from '@/types'
//aqí recinbe datos del papá, que es el modelValue y el cargando
//en el papá es: si el modelvalue viene vacío, está creando si vene un personal, ta editando
const props = defineProps<{
  modelValue?: AdminPersonal | null
  cargando?: boolean
}>()
//el hijo le manda cosas al papá 
//el submit que es el formulario que se le manda al papa  
//avisa q ya cancelaron 
const emit = defineEmits<{
  (e: 'submit', payload: { nombre: string; descripcion: string }): void
  (e: 'cancel'): void
}>()
//este es el formulario reactivo donde se van a guardar el nombre y descripción que se conecta con el v-model
const formulario = reactive({
  nombre: '',
  descripcion: '',
})
//este calcula que el formulario este en modo edición o no 
//si el props.modelvalue?.id existe entonces está editando, si no, está creando 
const editando = computed(() => !!props.modelValue?.id)
//bueno, este observa (vaya) el props.modelValue, cada vez que ese cambie esto se va a 
//ejecutar y llenar el formulario, por ejemplo si se abre el modal de editar, va a cargar los datos del id ese
//si el id viene null pues no pone nada
watch(
  () => props.modelValue,
  (valor) => {
    formulario.nombre = valor?.nombre ?? ''
    formulario.descripcion = valor?.descripcion ?? ''
  },
  { immediate: true }
)

function limpiarFormulario() {
  formulario.nombre = props.modelValue?.nombre ?? ''
  formulario.descripcion = props.modelValue?.descripcion ?? ''
  emit('cancel')
}
//hace el submit al formulario del papá 
function guardarPersonal() {
  emit('submit', {
    nombre: formulario.nombre.trim(),
    descripcion: formulario.descripcion.trim(),
  })
}
</script>

<template>
  <div class="formulario-panel">
    <div class="form-intro">
      <span class="form-tag">Datos del personal</span>
      <h4>{{ editando ? 'Actualiza la información del estilista' : 'Completa el perfil del nuevo estilista' }}</h4>
      <p>
        Captura un nombre claro y una descripción breve para identificar al personal dentro del sistema.
      </p>
    </div>

    <form class="admin-form" @submit.prevent="guardarPersonal">
      <div class="field-card">
        <div class="field-head">
          <label for="nombre-personal">Nombre del personal</label>
          <span>Visible en el panel administrativo</span>
        </div>

        <input
          id="nombre-personal"
          v-model="formulario.nombre"
          type="text"
          placeholder="Ej. Ana López"
          maxlength="120"
          required
        />
      </div>

      <div class="field-card">
        <div class="field-head">
          <label for="descripcion-personal">Descripción</label>
          <span>Agrega una breve reseña o especialidad</span>
        </div>

        <textarea
          id="descripcion-personal"
          v-model="formulario.descripcion"
          rows="5"
          maxlength="500"
          placeholder="Ej. Especialista en colorimetría, peinados sociales y tratamientos capilares."
          required
        />

        <small class="field-note">
          {{ formulario.descripcion.length }}/500 caracteres
        </small>
      </div>

      <div class="acciones-formulario">
        <button type="submit" class="primary-btn" :disabled="cargando">
          {{ cargando ? 'Guardando...' : editando ? 'Actualizar datos del personal' : 'Guardar datos del personal' }}
        </button>

        <button
          type="button"
          class="secondary-btn"
          :disabled="cargando"
          @click="limpiarFormulario"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.formulario-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-intro {
  padding: 18px 20px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(204, 213, 174, 0.35), rgba(250, 237, 205, 0.72));
  border: 1px solid rgba(212, 163, 115, 0.14);
}

.form-tag {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-bottom: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: #7a6048;
  font-size: 0.84rem;
  font-weight: 900;
  letter-spacing: 0.02em;
}

.form-intro h4 {
  margin: 0 0 8px;
  font-size: 1.25rem;
  color: #5f4b3a;
}

.form-intro p {
  margin: 0;
  color: #7b6a58;
  line-height: 1.7;
  font-size: 0.95rem;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(236, 231, 216, 0.9);
  box-shadow: 0 12px 26px rgba(92, 75, 59, 0.06);
}

.field-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-head label {
  color: #5f4b3a;
  font-weight: 900;
  font-size: 0.96rem;
}

.field-head span,
.field-note {
  color: #8a7764;
  font-size: 0.84rem;
  font-weight: 600;
}

input[type='text'],
textarea {
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.24);
  background: rgba(255, 255, 255, 0.96);
  color: #5f4b3a;
  font-size: 0.96rem;
  line-height: 1.6;
  outline: none;
  transition: border-color 0.24s ease, box-shadow 0.24s ease, transform 0.24s ease;
  font-family: inherit;
}

textarea {
  resize: vertical;
  min-height: 130px;
}

input[type='text']:focus,
textarea:focus {
  border-color: #d4a373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
  transform: translateY(-1px);
}

input[type='text']::placeholder,
textarea::placeholder {
  color: #b29b87;
}

.acciones-formulario {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.primary-btn,
.secondary-btn {
  padding: 12px 18px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 900;
  font-size: 0.95rem;
  transition: transform 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease;
}

.primary-btn {
  background: linear-gradient(135deg, #d4a373, #bf8c5a);
  color: white;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.24);
}

.secondary-btn {
  background: rgba(204, 213, 174, 0.58);
  color: #5f4b3a;
  box-shadow: 0 12px 24px rgba(179, 192, 136, 0.2);
}

.primary-btn:hover:not(:disabled),
.secondary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.primary-btn:disabled,
.secondary-btn:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-intro,
  .field-card {
    padding: 16px;
    border-radius: 18px;
  }

  .acciones-formulario {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
