<script setup lang = "ts">
import { useApiFetchDiego} from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth.ts'
import type { User } from '@/types'
import { ref } from 'vue'
import { useFetch } from '@vueuse/core'
import { useRouter } from 'vue-router'

//hola 
const authStore = useAuthStore()
const router = useRouter()
const errorLogin = ref('')
const loading = ref(false)

const credenciales = ref<User>({
    email: '',
    password: ''
})


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
    <div class="page-image"></div>
    <div class="page-overlay"></div>
    <div class="page-grid"></div>
    <div class="page-glow glow-1"></div>
    <div class="page-glow glow-2"></div>

    <section class="login-layout">
      <div class="login-hero">
        <div class="hero-topbar">
          <img src="@/assets/logolargo.png" class="hero-logo" alt="Logo Nova" />
        </div>

        <div class="hero-inner">
          <div class="hero-badge">Belleza & Bienestar</div>

          <div class="hero-content">
            <h1>Bienvenid@ a tu espacio</h1>
            <p class="hero-description">
              Estética Nova es tu refugio de cuidado personal. Inicia sesión para descubrir un mundo de servicios diseñados para realzar tu belleza y bienestar.
            </p>
          </div>

          <div class="hero-info-card">
            <p>
              Accede a tus citas, consulta tus servicios y mantén todo
              organizado desde una experiencia visual más cómoda, clara
              y moderna.
            </p>
          </div>
        </div>

        <div class="hero-decor">
          <span class="shape shape-1"></span>
          <span class="shape shape-2"></span>
          <span class="line line-1"></span>
          <span class="line line-2"></span>
        </div>
      </div>

      <div class="login-panel">
        <div class="panel-overlay"></div>
        <div class="panel-glow"></div>

        <div class="panel-content">
          <div class="panel-header">
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
  isolation: isolate;
  background: #ede6d7;
}

.page-image {
  position: absolute;
  inset: 0;
  background-image: url('@/assets/fondo-login.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: scale(1.03);
}

.page-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(74, 58, 38, 0.34) 0%,
      rgba(74, 58, 38, 0.18) 36%,
      rgba(245, 239, 229, 0.74) 68%,
      rgba(248, 243, 235, 0.9) 100%
    ),
    linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.14)
    );
}

.page-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 36px 36px;
  opacity: 0.22;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.65), transparent 90%);
  pointer-events: none;
}

.page-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(36px);
  pointer-events: none;
}

.glow-1 {
  top: -70px;
  left: -60px;
  width: 260px;
  height: 260px;
  background: rgba(255, 255, 255, 0.18);
  animation: floatBlob 14s ease-in-out infinite;
}

.glow-2 {
  right: 10%;
  bottom: -100px;
  width: 300px;
  height: 300px;
  background: rgba(212, 163, 115, 0.14);
  animation: floatBlob 18s ease-in-out infinite reverse;
}

.login-layout {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) minmax(320px, 0.65fr);
}

.login-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 42px 52px 48px;
  overflow: hidden;
}

.hero-topbar {
  position: relative;
  z-index: 2;
}

.hero-logo {
  width: clamp(170px, 20vw, 260px);
  height: auto;
  opacity: 0.95;
  animation: fadeUp 0.9s ease;
}

.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 720px;
  padding: 24px 0 18px;
}

.hero-badge {
  display: inline-flex;
  margin-bottom: 20px;
  padding: 11px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  animation: fadeUp 0.95s ease;
}

.hero-content {
  animation: slideLeft 1s ease;
}

.hero-kicker {
  margin: 0 0 14px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.94rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-content h1 {
  margin: 0;
  color: #ffffff;
  font-size: clamp(3.3rem, 6vw, 6rem);
  line-height: 0.98;
  font-weight: 900;
  letter-spacing: -0.04em;
  max-width: 620px;
  text-wrap: balance;
  text-shadow: 0 18px 40px rgba(0, 0, 0, 0.16);
}

.hero-description {
  margin: 24px 0 0;
  max-width: 560px;
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.08rem;
  line-height: 1.95;
  text-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}

.hero-info-card {
  position: relative;
  margin-top: 38px;
  max-width: 500px;
  padding: 22px 22px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(16px);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.08);
  animation: fadeUp 1.05s ease;
}

.hero-info-card::before {
  content: '';
  position: absolute;
  right: -40px;
  bottom: -50px;
  width: 150px;
  height: 150px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  filter: blur(8px);
}

.hero-info-label {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 800;
}

.hero-info-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.98rem;
  line-height: 1.8;
}

.hero-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shape,
.line {
  position: absolute;
  border-radius: 999px;
}

.shape {
  transform: rotate(-36deg);
  opacity: 0.18;
}

.shape-1 {
  left: 40px;
  bottom: 56px;
  width: 220px;
  height: 68px;
  background: rgba(255, 255, 255, 0.3);
  animation: floatSoft 5.5s ease-in-out infinite;
}

.shape-2 {
  left: 180px;
  bottom: 130px;
  width: 180px;
  height: 52px;
  background: rgba(255, 255, 255, 0.18);
  animation: floatSoft 7s ease-in-out infinite;
}

.line {
  height: 8px;
  background: rgba(255, 255, 255, 0.18);
}

.line-1 {
  left: 78px;
  bottom: 154px;
  width: 136px;
}

.line-2 {
  left: 238px;
  bottom: 100px;
  width: 112px;
}

.login-panel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 28px;
  background:
    linear-gradient(180deg, rgba(253, 249, 232, 0.72) 0%, rgba(255, 250, 239, 0.78) 100%);
  backdrop-filter: blur(10px);
}

.panel-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.05));
  pointer-events: none;
}

.panel-glow {
  position: absolute;
  top: 12%;
  right: 8%;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.1);
  filter: blur(32px);
  animation: pulseGlow 5s ease-in-out infinite;
}

.panel-content {
  position: relative;
  z-index: 1;
  width: min(100%, 420px);
  padding: 18px 4px;
  animation: slideRight 1s ease;
}

.panel-header {
  margin-bottom: 24px;
}

.panel-tag {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 9px 15px;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.16);
  color: #9a6942;
  font-size: 0.85rem;
  font-weight: 800;
}

.panel-content h2 {
  margin: 0 0 10px;
  font-size: clamp(2.2rem, 3.8vw, 3.4rem);
  color: #6a5241;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
}

.panel-subtitle {
  margin: 0;
  color: #7f6d5f;
  font-size: 0.98rem;
  line-height: 1.7;
}

.login-error {
  margin-bottom: 18px;
  padding: 14px 15px;
  border-radius: 16px;
  background: rgba(255, 228, 228, 0.94);
  color: #a14444;
  border: 1px solid rgba(161, 68, 68, 0.16);
  font-weight: 700;
  font-size: 0.92rem;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.05rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.form-group label {
  color: #6a5241;
  font-weight: 800;
  font-size: 0.98rem;
}

input {
  width: 100%;
  padding: 1rem 1.05rem;
  border-radius: 18px;
  border: 1px solid rgba(212, 163, 115, 0.14);
  background: rgba(255, 255, 255, 0.84);
  color: #6a5241;
  font-size: 0.97rem;
  outline: none;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

input::placeholder {
  color: #b49b83;
}

input:focus {
  transform: translateY(-1px);
  border-color: #d4a373;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
}

.login-button {
  margin-top: 0.55rem;
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #d4a373 0%, #c88f59 100%);
  color: white;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 16px 32px rgba(212, 163, 115, 0.24);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    filter 0.22s ease,
    opacity 0.22s ease;
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 38px rgba(212, 163, 115, 0.32);
  filter: brightness(1.03);
}

.login-button:disabled {
  cursor: not-allowed;
  opacity: 0.8;
  transform: none;
  box-shadow: 0 12px 24px rgba(180, 180, 180, 0.14);
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
    transform: rotate(-36deg) translateY(0);
  }
  50% {
    transform: rotate(-36deg) translateY(-12px);
  }
}

@keyframes floatBlob {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(12px, -16px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes pulseGlow {
  0% {
    transform: scale(1);
    opacity: 0.45;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0.45;
  }
}

@media (max-width: 1100px) {
  .login-layout {
    grid-template-columns: 1fr;
  }

  .login-hero {
    padding: 32px 28px 24px;
    min-height: auto;
  }

  .login-panel {
    padding: 34px 26px 42px;
    background: rgba(255, 248, 239, 0.78);
  }

  .hero-content h1 {
    max-width: 760px;
  }

  .hero-info-card {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .login-layout {
    min-height: 100vh;
  }

  .login-hero {
    padding: 24px 18px 18px;
  }

  .hero-logo {
    width: 150px;
  }

  .hero-badge {
    margin-bottom: 16px;
    padding: 9px 14px;
    font-size: 0.82rem;
  }

  .hero-kicker {
    font-size: 0.8rem;
    margin-bottom: 10px;
  }

  .hero-content h1 {
    font-size: clamp(2.35rem, 10vw, 3.8rem);
  }

  .hero-description {
    margin-top: 18px;
    font-size: 0.96rem;
    line-height: 1.75;
  }

  .hero-info-card {
    margin-top: 26px;
    padding: 18px 16px;
    border-radius: 22px;
  }

  .hero-info-card p {
    font-size: 0.92rem;
    line-height: 1.7;
  }

  .shape-1 {
    width: 170px;
    height: 54px;
    left: 10px;
    bottom: 26px;
  }

  .shape-2 {
    width: 120px;
    height: 40px;
    left: 110px;
    bottom: 86px;
  }

  .line-1,
  .line-2 {
    display: none;
  }

  .login-panel {
    padding: 24px 18px 30px;
  }

  .panel-content {
    width: 100%;
    max-width: 100%;
    padding: 8px 0;
  }

  .panel-header {
    margin-bottom: 24px;
  }

  .panel-content h2 {
    font-size: clamp(2.1rem, 9vw, 3.1rem);
  }

  .panel-subtitle {
    font-size: 0.96rem;
  }

  input,
  .login-button {
    border-radius: 16px;
  }
}

@media (max-width: 480px) {
  .login-hero {
    padding: 22px 14px 16px;
  }

  .login-panel {
    padding: 22px 14px 26px;
  }

  .hero-logo {
    width: 136px;
  }

  .hero-content h1 {
    font-size: clamp(2rem, 11vw, 3rem);
  }

  .hero-description {
    font-size: 0.92rem;
  }

  .hero-info-label,
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