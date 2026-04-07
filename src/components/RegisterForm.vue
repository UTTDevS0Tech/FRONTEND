<script setup lang="ts">
import { ref } from 'vue'
import type { RegisterData } from '@/types'

const formulario = ref<RegisterData>({
  nom: '',
  apellido_p: '',
  apellido_m: '',
  tel: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const cargando = ref(false)
const mensaje = ref('')
const error = ref('')

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
        error.value = data.message || 'No se pudo registrar la cuenta.'
      }
      return
    }

    mensaje.value =
      data.message || 'Cuenta creada correctamente. Revisa tu correo.'

    formulario.value = {
      nom: '',
      apellido_p: '',
      apellido_m: '',
      tel: '',
      email: '',
      password: '',
      password_confirmation: '',
    }
  } catch (e) {
    error.value = 'Error al conectar con el servidor.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <form class="register-form" @submit.prevent="registrar">
    <div class="form-row">
      <div class="form-group">
        <label for="nom">Nombre</label>
        <input
          id="nom"
          v-model="formulario.nom"
          type="text"
          placeholder="Tu nombre"
          required
        />
      </div>
    </div>

    <div class="form-row two-cols">
      <div class="form-group">
        <label for="apellido_p">Apellido paterno</label>
        <input
          id="apellido_p"
          v-model="formulario.apellido_p"
          type="text"
          placeholder="Apellido paterno"
          required
        />
      </div>

      <div class="form-group">
        <label for="apellido_m">Apellido materno</label>
        <input
          id="apellido_m"
          v-model="formulario.apellido_m"
          type="text"
          placeholder="Apellido materno"
          required
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="tel">Teléfono</label>
        <input
          id="tel"
          v-model="formulario.tel"
          type="text"
          placeholder="Opcional"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input
          id="email"
          v-model="formulario.email"
          type="email"
          placeholder="correo@ejemplo.com"
          required
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="formulario.password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          required
        />
      </div>
    </div>

    <div class="form-row">
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
    </div>

    <button class="btn-register" type="submit" :disabled="cargando">
      {{ cargando ? 'Creando cuenta...' : 'Crear cuenta' }}
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
  gap: 16px;
}

.form-row {
  display: flex;
  width: 100%;
}

.two-cols {
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
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
  margin-top: 8px;
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
  margin-top: 4px;
  color: #1d7a43;
  font-weight: 600;
  font-size: 0.95rem;
}

.error-message {
  margin-top: 4px;
  color: #c0392b;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .two-cols {
    flex-direction: column;
    gap: 16px;
  }
}
</style>