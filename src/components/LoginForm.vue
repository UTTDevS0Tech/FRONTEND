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


function login() {
    const { data, onFetchResponse, onFetchError} = useFetch('http://localhost:9000/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json' }
    }).post(credenciales.value).json()
      

    onFetchResponse(() => {
      const respuestadentrodedata = data.value.data
      console.log('Respuesta recibida para ver si entro el token:', data.value)
        if (data.value) {
          //aqui como ya creamos nuetra variable q accede a la informacion data(del fetch) y luego la del trait pues ya accedemos a nuesta ingo
            const token = respuestadentrodedata.token
            const informacionUsuario = respuestadentrodedata.user
            console.log("tengo el token? nomas pa probar al rato la borramos", token)
            console.log("tengo el usuario? nomas pa probar al rato la borramos", informacionUsuario?.rol_id)
            if (token ) {
                authStore.setLogin(token) 

            } 
            if (informacionUsuario) {
                authStore.setUsuario(informacionUsuario)

                const sacamosroldeusuario = informacionUsuario.rol_id

                if (sacamosroldeusuario === 1) {
                  router.push({ name: 'dashboard/personal' })
            } 
            if(sacamosroldeusuario === 2){
              router.push({name: 'dashboard/admin'})

            }
            if(sacamosroldeusuario === 3) {
              router.push({name: 'dashboard/cliente'})
            }


            
        }
      }
    })
}


/*

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


*/


</script>

<template>
  <main class="login-page">
    <div class="login-overlay"></div>

    <section class="login-shell">
      <div class="login-hero">
        <div class="hero-content">
          <span class="hero-tag">Belleza & Bienestar</span>
          <h1>Bienvenido a tu espacio</h1>
          <p>
            Ingresa para administrar citas, servicios y perfiles dentro del sistema
            de la estética con una experiencia cálida, limpia y moderna.
          </p>
        </div>

        <div class="hero-decor">
          <span class="shape shape-1"></span>
          <span class="shape shape-2"></span>
          <span class="shape shape-3"></span>
          <span class="shape line-1"></span>
          <span class="shape line-2"></span>
          <span class="shape line-3"></span>
        </div>
      </div>

      <div class="login-panel">
        <div class="panel-content">
          <h2>Iniciar Sesión</h2>
          <p class="panel-subtitle">Accede con tu correo y contraseña</p>

          <form class="login-form">
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
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

:global(*) {
  box-sizing: border-box;
}

/*
.login-page {
  min-height: 100vh;
  position: relative;
  display: grid;
  place-items: center;
  padding: 2rem;
  background:
    linear-gradient(135deg, rgba(204, 213, 174, 0.85), rgba(212, 163, 115, 0.72)),
    url('@/assets/login-bg.jpg') center/cover no-repeat;
  overflow: hidden;
}
*/

.login-page {
  background: linear-gradient(135deg, #CCD5AE 0%, #E9EDC9 35%, #FAEDCD 75%, #D4A373 100%);
}


.login-overlay {
  position: absolute;
  inset: 0;
  background: rgba(254, 250, 224, 0.10);
  backdrop-filter: blur(3px);
}

.login-shell {
  position: relative;
  z-index: 1;
  width: min(1120px, 100%);
  min-height: 670px;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  border-radius: 32px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 24px 60px rgba(92, 75, 59, 0.18);
  backdrop-filter: blur(14px);
}

.login-hero {
  position: relative;
  display: flex;
  align-items: center;
  padding: 3.2rem;
  background: linear-gradient(
    145deg,
    rgba(204, 213, 174, 0.92),
    rgba(233, 237, 201, 0.72),
    rgba(212, 163, 115, 0.88)
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 500px;
}

.hero-tag {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.5rem 0.95rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
}

.hero-content h1 {
  margin: 0 0 1rem;
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  line-height: 1.08;
  color: white;
  font-weight: 800;
}

.hero-content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.94);
  font-size: 1rem;
  line-height: 1.8;
  max-width: 430px;
}

.hero-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 999px;
  transform: rotate(-35deg);
  opacity: 0.34;
}

.shape-1 {
  width: 220px;
  height: 58px;
  left: 40px;
  bottom: 72px;
  background: #FAEDCD;
}

.shape-2 {
  width: 160px;
  height: 48px;
  left: 185px;
  bottom: 148px;
  background: #FEFAE0;
}

.shape-3 {
  width: 190px;
  height: 54px;
  left: 280px;
  bottom: 44px;
  background: #E9EDC9;
}

.line-1,
.line-2,
.line-3 {
  height: 8px;
  background: rgba(255, 255, 255, 0.38);
}

.line-1 {
  width: 120px;
  left: 58px;
  bottom: 130px;
}

.line-2 {
  width: 90px;
  left: 140px;
  bottom: 88px;
}

.line-3 {
  width: 100px;
  left: 315px;
  bottom: 120px;
}

.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  background: rgba(254, 250, 224, 0.84);
}

.panel-content {
  width: 100%;
  max-width: 360px;
}

.panel-content h2 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  color: #5f4b3a;
  font-weight: 800;
}

.panel-subtitle {
  margin: 0 0 2rem;
  color: #7b6a58;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.form-group label {
  color: #5f4b3a;
  font-weight: 700;
  font-size: 0.95rem;
}

input {
  width: 100%;
  padding: 0.95rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.25);
  background: rgba(255, 255, 255, 0.78);
  color: #5f4b3a;
  font-size: 0.96rem;
  outline: none;
  transition: 0.25s ease;
}

input::placeholder {
  color: #b09a82;
}

input:focus {
  border-color: #D4A373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
}

button {
  margin-top: 0.5rem;
  padding: 1rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(212, 163, 115, 0.32);
}

button:disabled {
  background-color: #ccc;
}

.error {
  color: red;
  font-size: 0.9rem;
}

@media (max-width: 920px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .login-hero {
    min-height: 280px;
    padding: 2rem;
  }

  .login-panel {
    padding: 2rem 1.25rem;
  }
}

@media (max-width: 560px) {
  .login-page {
    padding: 1rem;
  }

  .hero-content h1 {
    font-size: 2rem;
  }
}
</style>