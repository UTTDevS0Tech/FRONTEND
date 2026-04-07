<script setup lang="ts">
import { RouterLink } from 'vue-router'
import RegisterForm from '@/components/RegisterForm.vue'
</script>

<template>
  <main class="register-page">
    <section class="register-wrapper">
      <div class="register-card">
        <span class="brand-tag">Estética Nova</span>

        <h1>Crea tu cuenta</h1>
        <p class="subtitle">
          Regístrate para comenzar a agendar tus citas y disfrutar la experiencia
          completa.
        </p>

        <RegisterForm />

        <div class="login-link">
          <span>¿Ya tienes cuenta?</span>
          <RouterLink to="/login">Inicia sesión</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    linear-gradient(rgba(35, 25, 18, 0.4), rgba(35, 25, 18, 0.45)),
    url('@/assets/banner-principal.jpg') center/cover no-repeat;
}

.register-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.register-card {
  width: 100%;
  max-width: 620px;
  padding: 34px 28px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.93);
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);
  animation: fadeUp 0.6s ease;
}

.brand-tag {
  display: inline-block;
  margin-bottom: 14px;
  color: #b07a49;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.register-card h1 {
  margin: 0;
  font-size: 2rem;
  color: #4f3727;
}

.subtitle {
  margin: 12px 0 24px;
  color: #6f5847;
  line-height: 1.6;
}

.login-link {
  margin-top: 22px;
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  color: #6f5847;
}

.login-link a {
  color: #b07a49;
  font-weight: 700;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .register-page {
    padding: 16px;
  }

  .register-card {
    padding: 28px 20px;
    border-radius: 22px;
  }

  .register-card h1 {
    font-size: 1.7rem;
  }
}
</style>