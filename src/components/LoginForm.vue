<script setup lang = "ts">
import { useApiFetchDiego} from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth.ts'
import type { User } from '@/types'
import { ref } from 'vue'
import { useFetch } from '@vueuse/core'
import { useRouter } from 'vue-router'


const authStore = useAuthStore()
const router = useRouter()
const errorLogin = ref('')
const loading = ref(false)

const credenciales = ref<User>({
    email: '',
    password: ''
})

//hdtpm jala we


function login() {
  errorLogin.value = ''
  loading.value = true

  const { data, onFetchResponse, onFetchError } = useFetch('https://api.carlosd-dev.me/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }).post(credenciales.value).json()

  onFetchResponse(() => {
    loading.value = false

    // ⚠️ si backend manda error (ej: credenciales incorrectas)
    if (!data.value || data.value.status === 'error') {
      errorLogin.value = data.value?.message || 'Correo o contraseña incorrectos'
      return
    }

    const res = data.value.data
    const token = res?.token
    const usuario = res?.user

    if (!token) {
      errorLogin.value = 'No se pudo iniciar sesión'
      return
    }

    authStore.setLogin(token)

    if (usuario) {
      authStore.setUsuario(usuario)

      const rol = usuario.rol_id

      if (rol === 1) router.push({ name: 'dashboard/estilista' })
      if (rol === 2) router.push({ name: 'dashboard/admin' })
      if (rol === 3) router.push({ name: 'dashboard/cliente' })
      if (rol === 4) router.push({ name: 'dashboard/personal' })
    }
  })

  onFetchError(() => {
    loading.value = false
    errorLogin.value = 'Credenciales incorrectas o error de conexión'
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
    <div class="page-gradient"></div>
    <div class="page-mesh"></div>
    <div class="ambient ambient-1"></div>
    <div class="ambient ambient-2"></div>
    <div class="ambient ambient-3"></div>

    <section class="login-shell">
      <div class="login-hero">
        <img src="@/assets/logolargo.png" class="hero-logo" alt="Logo Nova" />

        <div class="hero-badge">Belleza & Bienestar</div>

        <div class="hero-content">
          <p class="hero-kicker">Tu espacio de cuidado personal</p>
          <h1>Bienvenido a tu espacio</h1>
          <p class="hero-description">
            Estética Nova es tu refugio de cuidado personal. Inicia sesión para descubrir un mundo de servicios diseñados para realzar tu belleza y bienestar.
          </p>
        </div>

        <div class="hero-card">
          <span class="hero-card-label">Experiencia Nova</span>
          <p>
            Accede a tus citas, consulta tus servicios y mantén todo organizado
            desde una experiencia visual más cómoda, clara y moderna.
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
        <div class="panel-glow"></div>

        <div class="panel-content">
          <div class="panel-header">
            <span class="panel-tag">Acceso</span>
            <h2>Iniciar Sesión</h2>
            <p class="panel-subtitle">Accede con tu correo y contraseña</p>
          </div>

          <div v-if="errorLogin" class="login-error">
            {{ errorLogin }}
          </div>

          <form class="login-form" @submit.prevent="login">
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

            <button type="submit" :disabled="loading" class="login-button">
              {{ loading ? 'Entrando...' : 'Entrar' }}
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

.login-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #ccd5ae 0%, #e9edc9 34%, #faedcd 72%, #d4a373 100%);
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.26), transparent 28%),
    radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.14), transparent 26%);
  pointer-events: none;
}

.page-mesh {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 38px 38px;
  opacity: 0.3;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), transparent 90%);
  pointer-events: none;
}

.ambient {
  position: absolute;
  border-radius: 999px;
  filter: blur(24px);
  pointer-events: none;
}

.ambient-1 {
  top: 6%;
  left: -4%;
  width: 220px;
  height: 220px;
  background: rgba(255, 255, 255, 0.22);
  animation: blobFloat 11s ease-in-out infinite;
}

.ambient-2 {
  right: -3%;
  top: 22%;
  width: 260px;
  height: 260px;
  background: rgba(250, 237, 205, 0.28);
  animation: blobFloat 14s ease-in-out infinite reverse;
}

.ambient-3 {
  bottom: -4%;
  left: 35%;
  width: 260px;
  height: 260px;
  background: rgba(212, 163, 115, 0.18);
  animation: blobFloat 16s ease-in-out infinite;
}

.login-shell {
  position: relative;
  z-index: 1;
  width: min(1380px, 100%);
  min-height: calc(100vh - 48px);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  border-radius: 36px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.34);
  box-shadow: 0 28px 80px rgba(92, 75, 59, 0.18);
  backdrop-filter: blur(16px);
  animation: fadeUp 0.9s ease;
}

.login-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 56px 56px;
  background:
    linear-gradient(
      145deg,
      rgba(204, 213, 174, 0.9) 0%,
      rgba(233, 237, 201, 0.72) 42%,
      rgba(212, 163, 115, 0.88) 100%
    );
  overflow: hidden;
}

.hero-logo {
  width: clamp(140px, 18vw, 210px);
  height: auto;
  margin-bottom: 42px;
  position: relative;
  z-index: 2;
  opacity: 0.96;
  animation: fadeUp 1s ease;
}

.hero-badge {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-self: flex-start;
  margin-bottom: 18px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 620px;
  animation: slideLeft 1s ease;
}

.hero-kicker {
  margin: 0 0 14px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-content h1 {
  margin: 0 0 18px;
  font-size: clamp(2.8rem, 5vw, 5rem);
  line-height: 1.02;
  color: white;
  font-weight: 900;
  text-wrap: balance;
}

.hero-description {
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.08rem;
  line-height: 1.9;
  max-width: 540px;
}

.hero-card {
  position: relative;
  z-index: 2;
  margin-top: 34px;
  max-width: 470px;
  padding: 20px 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 38px rgba(91, 72, 54, 0.12);
  animation: fadeUp 1.1s ease;
}

.hero-card-label {
  display: inline-block;
  margin-bottom: 10px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 800;
}

.hero-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.75;
  font-size: 0.96rem;
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
  opacity: 0.32;
}

.shape-1 {
  width: 270px;
  height: 70px;
  left: 34px;
  bottom: 70px;
  background: #faedcd;
  animation: floatSoft 5s ease-in-out infinite;
}

.shape-2 {
  width: 190px;
  height: 56px;
  left: 220px;
  bottom: 160px;
  background: #fefae0;
  animation: floatSoft 6s ease-in-out infinite;
}

.shape-3 {
  width: 240px;
  height: 64px;
  left: 390px;
  bottom: 34px;
  background: #e9edc9;
  animation: floatSoft 7s ease-in-out infinite;
}

.line-1,
.line-2,
.line-3 {
  height: 9px;
  background: rgba(255, 255, 255, 0.35);
}

.line-1 {
  width: 150px;
  left: 82px;
  bottom: 148px;
}

.line-2 {
  width: 110px;
  left: 178px;
  bottom: 98px;
}

.line-3 {
  width: 120px;
  left: 434px;
  bottom: 138px;
}

.login-panel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 46px;
  background:
    linear-gradient(180deg, rgba(254, 250, 224, 0.95) 0%, rgba(255, 248, 235, 0.9) 100%);
}

.panel-glow {
  position: absolute;
  top: -60px;
  right: -40px;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.14);
  filter: blur(28px);
  animation: pulseGlow 4.5s ease-in-out infinite;
}

.panel-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 430px;
  padding: 10px 0;
  animation: slideRight 1s ease;
}

.panel-header {
  margin-bottom: 26px;
}

.panel-tag {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.14);
  color: #93653e;
  font-size: 0.86rem;
  font-weight: 800;
}

.panel-content h2 {
  margin: 0 0 8px;
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  color: #5f4b3a;
  font-weight: 900;
  line-height: 1.05;
}

.panel-subtitle {
  margin: 0;
  color: #7b6a58;
  font-size: 1rem;
  line-height: 1.7;
}

.login-error {
  margin-bottom: 18px;
  padding: 13px 14px;
  border-radius: 16px;
  background: rgba(255, 228, 228, 0.92);
  color: #a14444;
  border: 1px solid rgba(161, 68, 68, 0.16);
  font-weight: 700;
  font-size: 0.92rem;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.52rem;
}

.form-group label {
  color: #5f4b3a;
  font-weight: 800;
  font-size: 0.98rem;
}

input {
  width: 100%;
  padding: 1.05rem 1.1rem;
  border-radius: 18px;
  border: 1px solid rgba(212, 163, 115, 0.2);
  background: rgba(255, 255, 255, 0.88);
  color: #5f4b3a;
  font-size: 1rem;
  outline: none;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

input::placeholder {
  color: #b09a82;
}

input:focus {
  transform: translateY(-1px);
  border-color: #d4a373;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
}

.login-button {
  margin-top: 0.5rem;
  width: 100%;
  padding: 1.08rem 1rem;
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #d4a373 0%, #bf8c5a 100%);
  color: white;
  font-weight: 800;
  font-size: 1.02rem;
  cursor: pointer;
  box-shadow: 0 16px 30px rgba(212, 163, 115, 0.28);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    filter 0.22s ease,
    opacity 0.22s ease;
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 34px rgba(212, 163, 115, 0.35);
  filter: brightness(1.03);
}

.login-button:disabled {
  cursor: not-allowed;
  opacity: 0.78;
  transform: none;
  box-shadow: 0 12px 24px rgba(180, 180, 180, 0.16);
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
    transform: translateX(-24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(24px);
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

@keyframes blobFloat {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(10px, -14px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes pulseGlow {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.85;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

@media (max-width: 1100px) {
  .login-page {
    padding: 18px;
  }

  .login-shell {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .login-hero {
    padding: 42px 34px 28px;
  }

  .login-panel {
    padding: 34px 28px 38px;
  }

  .hero-card {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .login-page {
    padding: 0;
    min-height: 100vh;
  }

  .login-shell {
    width: 100%;
    min-height: 100vh;
    border-radius: 0;
    grid-template-columns: 1fr;
  }

  .login-hero {
    padding: 26px 20px 22px;
    min-height: auto;
  }

  .hero-logo {
    width: 148px;
    margin-bottom: 26px;
  }

  .hero-badge {
    margin-bottom: 14px;
    padding: 9px 14px;
    font-size: 0.82rem;
  }

  .hero-kicker {
    font-size: 0.8rem;
    margin-bottom: 10px;
  }

  .hero-content h1 {
    font-size: clamp(2.25rem, 9vw, 3.4rem);
    margin-bottom: 14px;
  }

  .hero-description {
    font-size: 0.96rem;
    line-height: 1.75;
  }

  .hero-card {
    margin-top: 24px;
    padding: 18px 16px;
    border-radius: 20px;
  }

  .hero-card p {
    font-size: 0.92rem;
    line-height: 1.65;
  }

  .shape-1 {
    width: 180px;
    height: 54px;
    left: 12px;
    bottom: 44px;
  }

  .shape-2 {
    width: 120px;
    height: 42px;
    left: 130px;
    bottom: 108px;
  }

  .shape-3 {
    width: 150px;
    height: 48px;
    left: 200px;
    bottom: 16px;
  }

  .line-1,
  .line-2,
  .line-3 {
    display: none;
  }

  .login-panel {
    padding: 26px 20px 34px;
  }

  .panel-content {
    max-width: 100%;
  }

  .panel-header {
    margin-bottom: 22px;
  }

  .panel-content h2 {
    font-size: clamp(2rem, 8vw, 2.7rem);
  }

  .panel-subtitle {
    font-size: 0.96rem;
    line-height: 1.6;
  }

  input,
  .login-button {
    border-radius: 16px;
  }
}

@media (max-width: 480px) {
  .login-hero {
    padding: 22px 16px 18px;
  }

  .login-panel {
    padding: 22px 16px 28px;
  }

  .hero-logo {
    width: 134px;
  }

  .hero-content h1 {
    font-size: clamp(2rem, 10vw, 2.8rem);
  }

  .hero-description {
    font-size: 0.92rem;
  }

  .hero-card-label,
  .panel-tag {
    font-size: 0.78rem;
  }

  .login-error {
    font-size: 0.88rem;
    border-radius: 14px;
  }

  input {
    padding: 1rem;
    font-size: 0.96rem;
  }

  .login-button {
    padding: 1rem;
    font-size: 0.98rem;
  }
}
</style>