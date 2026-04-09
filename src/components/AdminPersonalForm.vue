<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type {
  AdminPersonal,
  AdminPersonalPayload,
  AdminPersonalUpdatePayload,
} from '@/types'

const props = defineProps<{
  modelValue?: AdminPersonal | null
  cargando?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: AdminPersonalPayload | AdminPersonalUpdatePayload): void
  (e: 'cancel'): void
}>()

const formulario = reactive({
  nombre: '',
  descripcion: '',
})

const editando = computed(() => {
  return !!props.modelValue?.id
})

watch(
  () => props.modelValue,
  (valor) => {
    formulario.nombre = valor?.nombre ?? ''
    formulario.descripcion = valor?.descripcion ?? ''
  },
  { immediate: true }
)

function limpiarFormulario() {
  formulario.nombre = ''
  formulario.descripcion = ''
  emit('cancel')
}

function guardarPersonal() {
  if (!editando.value) {
    const payload: AdminPersonalPayload = {
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      user_id: 0,
    }

    emit('submit', payload)
    return
  }

  const payload: AdminPersonalUpdatePayload = {
    nombre: formulario.nombre,
    descripcion: formulario.descripcion,
  }

  emit('submit', payload)
}
</script>

<template>
  <div class="formulario-panel">
    <form class="admin-form" @submit.prevent="guardarPersonal">
      <div class="form-group">
        <label>Nombre del personal</label>
        <input
          v-model="formulario.nombre"
          type="text"
          placeholder="Ej. Ana López"
          required
        />
      </div>

      <div class="form-group">
        <label>Descripción</label>
        <textarea
          v-model="formulario.descripcion"
          rows="4"
          placeholder="Describe brevemente al estilista"
          required
        />
      </div>

      <div class="acciones-formulario">
        <button type="submit" :disabled="cargando">
          {{ editando ? 'Actualizar datos del personal' : 'Guardar datos del personal' }}
        </button>

        <button
          type="button"
          class="secondary"
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
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #5f4b3a;
  font-weight: 800;
  font-size: 0.92rem;
}

input[type='text'],
textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: rgba(255, 255, 255, 0.92);
  color: #5f4b3a;
  font-size: 0.95rem;
  outline: none;
  transition: 0.25s ease;
  font-family: inherit;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

input[type='text']:focus,
textarea:focus {
  border-color: #d4a373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
}

.acciones-formulario {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
}

button {
  padding: 10px 14px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 800;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.acciones-formulario button {
  background: linear-gradient(135deg, #d4a373, #bf8c5a);
  color: white;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.25);
}

.acciones-formulario button.secondary {
  background: linear-gradient(135deg, #ccd5ae, #b8c493);
  color: #5f4b3a;
  box-shadow: 0 14px 24px rgba(179, 192, 136, 0.22);
}
</style>
