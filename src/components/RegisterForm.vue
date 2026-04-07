<script setup lang="ts">
import { ref } from 'vue'
import type { User } from '@/types'

const emit = defineEmits<{
  submitted: []
}>()

const formulario = ref<User & { password_confirmation: string }>({
  email: '',
  password: '',
  password_confirmation: '',
})

const mensaje = ref('')
const error = ref('')
const cargando = ref(false)

async function registrar() {
  mensaje.value = ''
  error.value = ''
  cargando.value = true

  try {
    const response = await fetch('https://api.carlosd-dev.me/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formulario.value),
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.errors) {
        const primerError = Object.values(data.errors).flat()[0]
        error.value = String(primerError)
      } else {
        error.value = data.message || 'No se pudo registrar el usuario.'
      }
      return
    }

    mensaje.value =
      data.message || 'Usuario registrado correctamente. Revisa tu correo.'
    emit('submitted')

    formulario.value = {
      email: '',
      password: '',
      password_confirmation: '',
    }
  } catch (err) {
    error.value = 'Error al conectar con el servidor.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <form class="register-form" @submit.prevent="registrar">
    <div class="form-group">
      <label for="email">Correo electrónico</label>
      <input
        id="email"
        v-model="formulario.email"
        type="email"
        placeholder="Ingresa tu correo"
        required
      />
    </div>

    <div class="form-group">
      <label for="password">Contraseña</label>
      <input
        id="password"
        v-model="formulario.password"
        type="password"
        placeholder="Ingresa tu contraseña"
        required
      />
    </div>

    <div class="form-group">
      <label for="password_confirmation">Confirmar contraseña</label>
      <input
        id="password_confirmation"
        v-model="formulario.password_confirmation"
        type="password"
        placeholder="Confirma tu contraseña"
        required
      />
    </div>

    <button type="submit" class="btn-register" :disabled="cargando">
      {{ cargando ? 'Registrando...' : 'Crear cuenta' }}
    </button>

    <p v-if="mensaje" class="success-message">
      {{ mensaje }}
    </p>

    <p v-if="error" class="error-message">
      {{ error }}
    </p>
  </form>
</template>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #5f4530;
}

.form-group input {
  width: 100%;
  height: 50px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid #dbc8b6;
  background: rgba(255, 255, 255, 0.96);
  font-size: 0.98rem;
  outline: none;
  transition: all 0.2s ease;
}

.form-group input:focus {
  border-color: #c9925d;
  box-shadow: 0 0 0 4px rgba(201, 146, 93, 0.14);
}

.btn-register {
  height: 52px;
  border: none;
  border-radius: 14px;
  background: #d9a574;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-register:hover {
  background: #c9925d;
  transform: translateY(-2px);
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.success-message {
  color: #1d7a43;
  font-weight: 600;
  font-size: 0.95rem;
}

.error-message {
  color: #c0392b;
  font-weight: 600;
  font-size: 0.95rem;
}
</style>