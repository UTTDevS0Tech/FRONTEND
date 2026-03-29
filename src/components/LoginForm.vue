<script setup lang = "ts">
import { useApiFetchDiego} from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types'
import { ref } from 'vue'
import { useFetch } from '@vueuse/core'
import { useRouter } from 'vue-router'


const authStore = useAuthStore()
const router = useRouter()

const credenciales = ref<User>({
    email: '',
    password: ''
})

/*
function login() {
    const { data, onFetchResponse, onFetchError} = useFetch('http://localhost:9000/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json' }
    }).post(credenciales.value).json()
      

    onFetchResponse(() => {
      console.log('Respuesta recibida para ver si entro el token:', data.value)
        if (data.value) {
            const token = data.value.token
            const informacionUsuario = data.value.user
            if (token ) {
                authStore.setLogin(token) 

            } 
            if (informacionUsuario) {
                authStore.setUsuario(informacionUsuario)
            }
            router.push('/dashboard')
        }
        
    })
}
*/



function login() {
  const { data, error, onFetchResponse, onFetchError } = useFetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }).post(credenciales.value).json()

  onFetchResponse(() => {
    console.log('Respuesta recibida:', data.value)

    const token = data.value?.data?.token
    const informacionUsuario = data.value?.data?.user

    if (!token) {
      console.error('No llegó token')
      return
    }

    authStore.setLogin(token)

    if (informacionUsuario) {
      authStore.setUsuario(informacionUsuario)
    }

    router.push('/dashboard')
  })

  onFetchError(() => {
    console.error('Error en login:', error.value)
  })
}





</script>
<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    
    <form>
      <div class="form-group">
        <label>Correo Electrónico</label>
        <input 
          v-model="credenciales.email" 
          type="email" 
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div class="form-group">
        <label>Contraseña</label>
        <input 
          v-model="credenciales.password" 
          type="password" 
          placeholder="********"
        />
      </div>

      <button type="button" @click="login">
        Entrar
      </button>
    </form>
  </div>
</template>
<style scoped>

.login-container { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
form { display: flex; flex-direction: column; gap: 1rem; }
input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 10px; background-color: #42b883; color: white; border: none; cursor: pointer; }
button:disabled { background-color: #ccc; }
.error { color: red; font-size: 0.9rem; }
</style>