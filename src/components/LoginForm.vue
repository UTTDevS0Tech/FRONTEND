<script setup lang = "ts">
import { useApiFetchDiego} from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth.ts'
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
    const { data, onFetchResponse, onFetchError} = useFetch('https://api.carlosd-dev.me/api/login', {
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
                  router.push({ name: 'dashboard/estilista' })
            } 
            if(sacamosroldeusuario === 2){
              router.push({name: 'dashboard/admin'})

            }
            if(sacamosroldeusuario === 3) {
              router.push({name: 'dashboard/cliente'})
            }
            if(sacamosroldeusuario === 4) {
              router.push({name: 'dashboard/personal'})
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
        <img src="@/assets/logolargo.png" class="hero-logo" alt="Logo Nova" />
        <div class="hero-content">
          <span class="hero-tag">Belleza & Bienestar</span>
          <h1>Bienvenido a tu espacio</h1>
          <p>
            Estética Nova es tu refugio de cuidado personal. Inicia sesión para descubrir un mundo de servicios diseñados para realzar tu belleza y bienestar.
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
:global(*) {
  box-sizing: border-box;
}

.hero-logo {
  position: absolute;
  top: 30px;
  left: 40px;
  width: 180px;
  height: auto;
  z-index: 3;
  opacity: 0.95;
  animation: fadeUp 1s ease;
}

.login-page {
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: grid;
  place-items: center;
  padding: 40px;
  overflow: hidden;
  background: linear-gradient(135deg, #CCD5AE 0%, #E9EDC9 35%, #FAEDCD 75%, #D4A373 100%);
}

.login-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 40%);
  backdrop-filter: blur(2px);
}

.login-shell {
  position: relative;
  z-index: 1;
  width: min(1380px, 100%);
  min-height: 760px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  border-radius: 34px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.36);
  box-shadow: 0 26px 80px rgba(92, 75, 59, 0.20);
  backdrop-filter: blur(16px);
  animation: fadeUp 0.9s ease;
}

.login-hero {
  position: relative;
  display: flex;
  align-items: center;
  padding: 90px 70px 70px;
  background: linear-gradient(
    145deg,
    rgba(204, 213, 174, 0.94),
    rgba(233, 237, 201, 0.78),
    rgba(212, 163, 115, 0.88)
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 620px;
  animation: slideLeft 1s ease;
  margin-top: 60px; 
}

.hero-tag {
  display: inline-block;
  margin-bottom: 1.2rem;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.24);
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.hero-content h1 {
  margin: 0 0 1.3rem;
  font-size: clamp(3.2rem, 5vw, 5rem);
  line-height: 1.02;
  color: white;
  font-weight: 900;
}

.hero-content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.12rem;
  line-height: 1.95;
  max-width: 520px;
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
  width: 270px;
  height: 70px;
  left: 60px;
  bottom: 88px;
  background: #FAEDCD;
  animation: floatSoft 5s ease-in-out infinite;
}

.shape-2 {
  width: 190px;
  height: 56px;
  left: 240px;
  bottom: 180px;
  background: #FEFAE0;
  animation: floatSoft 6s ease-in-out infinite;
}

.shape-3 {
  width: 240px;
  height: 64px;
  left: 380px;
  bottom: 54px;
  background: #E9EDC9;
  animation: floatSoft 7s ease-in-out infinite;
}

.line-1,
.line-2,
.line-3 {
  height: 9px;
  background: rgba(255, 255, 255, 0.38);
}

.line-1 {
  width: 150px;
  left: 78px;
  bottom: 160px;
}

.line-2 {
  width: 110px;
  left: 190px;
  bottom: 108px;
}

.line-3 {
  width: 120px;
  left: 430px;
  bottom: 145px;
}

.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 50px;
  background: rgba(254, 250, 224, 0.90);
}

.panel-content {
  width: 100%;
  max-width: 420px;
  animation: slideRight 1s ease;
}

.panel-content h2 {
  margin: 0 0 0.5rem;
  font-size: 3rem;
  color: #5f4b3a;
  font-weight: 900;
}

.panel-subtitle {
  margin: 0 0 2.3rem;
  color: #7b6a58;
  font-size: 1.05rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #5f4b3a;
  font-weight: 800;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 1.1rem 1.15rem;
  border-radius: 18px;
  border: 1px solid rgba(212, 163, 115, 0.25);
  background: rgba(255, 255, 255, 0.86);
  color: #5f4b3a;
  font-size: 1rem;
  outline: none;
  transition: 0.25s ease;
}

input::placeholder {
  color: #b09a82;
}

input:focus {
  transform: translateY(-1px);
  border-color: #D4A373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
}

button {
  margin-top: 0.7rem;
  padding: 1.1rem;
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  font-weight: 800;
  font-size: 1.05rem;
  cursor: pointer;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

button:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 20px 34px rgba(212, 163, 115, 0.34);
  filter: brightness(1.03);
}

button:disabled {
  background-color: #ccc;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(-22px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(22px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes floatSoft {
  0%, 100% {
    transform: rotate(-35deg) translateY(0);
  }
  50% {
    transform: rotate(-35deg) translateY(-12px);
  }
}
</style>