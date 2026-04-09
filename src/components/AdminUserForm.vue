<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { AdminUser, AdminUserPayload, AdminUserUpdatePayload } from '@/types'

const props = defineProps<{
  modelValue?: AdminUser | null
  cargando?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: AdminUserPayload | AdminUserUpdatePayload): void
  (e: 'cancel'): void
}>()

const formulario = reactive({
  email: '',
  password: '',
  password_confirmation: '',
  activo: true,
  rol_id: 1,
})

const editando = computed(() => {
  return !!props.modelValue?.id
})

watch(
  () => props.modelValue,
  (valor) => {
    formulario.email = valor?.email ?? ''
    formulario.password = ''
    formulario.password_confirmation = ''
    formulario.activo = valor?.activo ?? true
    formulario.rol_id = valor?.rol_id ?? 1
  },
  { immediate: true }
)

function limpiarFormulario() {
  formulario.email = ''
  formulario.password = ''
  formulario.password_confirmation = ''
  formulario.activo = true
  formulario.rol_id = 1
  emit('cancel')
}

function guardarUsuario() {
  if (!editando.value) {
    const payload: AdminUserPayload = {
      email: formulario.email,
      password: formulario.password,
      password_confirmation: formulario.password_confirmation,
      activo: formulario.activo,
      rol_id: 1,
    }

    emit('submit', payload)
    return
  }

  const payload: AdminUserUpdatePayload = {
    email: formulario.email,
    activo: formulario.activo,
    rol_id: 1,
  }

  if (formulario.password.trim()) {
    payload.password = formulario.password
    payload.password_confirmation = formulario.password_confirmation
  }

  emit('submit', payload)
}
</script>

<template>
  <div class="formulario-panel">
    <form class="admin-form" @submit.prevent="guardarUsuario">
      <div class="form-group">
        <label>Correo electrónico</label>
        <input
          v-model="formulario.email"
          type="email"
          placeholder="Ej. estilista@correo.com"
          required
        />
      </div>

      <div class="form-group">
        <label>
          {{ editando ? 'Nueva contraseña (opcional)' : 'Contraseña' }}
        </label>
        <input
          v-model="formulario.password"
          type="password"
          :required="!editando"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div class="form-group">
        <label>
          {{ editando ? 'Confirmar nueva contraseña (opcional)' : 'Confirmar contraseña' }}
        </label>
        <input
          v-model="formulario.password_confirmation"
          type="password"
          :required="!editando"
          placeholder="Repite la contraseña"
        />
      </div>

      <div class="form-group check-group">
        <label class="checkbox-wrap">
          <input
            v-model="formulario.activo"
            type="checkbox"
          />
          <span>Usuario activo</span>
        </label>
      </div>

      <div class="acciones-formulario">
        <button type="submit" :disabled="cargando">
          {{ editando ? 'Actualizar credenciales' : 'Crear credenciales' }}
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

input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: rgba(255, 255, 255, 0.92);
  color: #5f4b3a;
  font-size: 0.95rem;
  outline: none;
  transition: 0.25s ease;
}

input[type='email']:focus,
input[type='password']:focus {
  border-color: #d4a373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
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
  accent-color: #d4a373;
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
