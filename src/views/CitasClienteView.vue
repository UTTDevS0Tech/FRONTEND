<script setup lang="ts">
import CitasClienteForm from '@/components/CitasClienteForm.vue'
</script>

<template>
  <main class="citas-cliente-view">
    <section class="hero">
      <div class="hero-badge">Estética Nova</div>
      <h1>Agenda tu cita</h1>
      <p>
        Reserva tu espacio de forma rápida y elige el servicio ideal para ti.
      </p>
    </section>

    <section class="content-shell">
      <div class="content-card">
        <div class="content-head">
          <div>
            <span class="eyebrow">Reservación</span>
            <h2>Nueva cita</h2>
            <p>Completa la información para confirmar tu visita.</p>
          </div>
        </div>

        <CitasClienteForm />
      </div>
    </section>
  </main>
</template>

<style scoped>
.citas-cliente-view {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(212, 163, 115, 0.14), transparent 28%),
    linear-gradient(180deg, #fefae0 0%, #faedcd 100%);
  padding: 2rem 1.2rem 3rem;
}

.hero {
  width: min(1100px, 100%);
  margin: 0 auto 1.6rem;
  text-align: center;
  padding: 2rem 1rem 1rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.18);
  color: #b9793f;
  font-weight: 800;
  font-size: 0.85rem;
}

.hero h1 {
  margin: 1rem 0 0.7rem;
  font-size: clamp(2rem, 5vw, 3.2rem);
  color: #5f4b3a;
}

.hero p {
  max-width: 700px;
  margin: 0 auto;
  color: #7b6652;
  line-height: 1.7;
}

.content-shell {
  width: min(1100px, 100%);
  margin: 0 auto;
}

.content-card {
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(212, 163, 115, 0.2);
  border-radius: 32px;
  padding: 1.5rem;
  box-shadow: 0 24px 50px rgba(95, 75, 58, 0.08);
  backdrop-filter: blur(14px);
}

.content-head {
  margin-bottom: 1.3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(212, 163, 115, 0.16);
}

.eyebrow {
  color: #d4a373;
  font-weight: 800;
  font-size: 0.88rem;
}

.content-head h2 {
  margin: 0.35rem 0;
  color: #5f4b3a;
  font-size: 1.8rem;
}

.content-head p {
  margin: 0;
  color: #8a725c;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .citas-cliente-view {
    padding: 1.2rem 0.9rem 2rem;
  }

  .content-card {
    padding: 1rem;
    border-radius: 24px;
  }

  .hero {
    padding-top: 1rem;
  }
}
</style>