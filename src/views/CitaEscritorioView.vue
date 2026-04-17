<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import CitaEscritorioForm from '@/components/CitaEscritorioForm.vue'
import { useTipoServiciosStore } from '@/stores/tipoServicios'
import { useCitaEscritorioStore } from '@/stores/citaEscritorio'
import { useClienteStore } from '@/stores/cliente'
import { usePersonalStore } from '@/stores/personal'
import type {
  FormularioCitaEscritorio,
  CitaEscritorioPayload,
} from '@/types/citaEscritorio'

const citaStore = useCitaEscritorioStore()
const clienteStore = useClienteStore()
const personalStore = usePersonalStore()
const tipoServicioStore = useTipoServiciosStore()
const route = useRoute()

function crearFormularioVacio(): FormularioCitaEscritorio {
  return {
    total: 0,
    personal_id: null,
    hora_c: '',
    fecha_c: '',
    estado: 'pendiente',
    cliente_id: null,
    detalles: [
      {
        servicio_id: null,
        subtotal: 0,
      },
    ],
  }
}

const modeloFormulario = ref<FormularioCitaEscritorio>(crearFormularioVacio())

onMounted(async () => {
  await Promise.all([
    citaStore.obtenerCitas(),
    clienteStore.obtenerClientes(),
    personalStore.obtenerPersonales(),
    tipoServicioStore.obtenerTiposServicio(),
  ])

  const clienteId = Number(route.query.cliente_id)

  if (!Number.isNaN(clienteId) && clienteId > 0) {
    modeloFormulario.value.cliente_id = clienteId
  }
})

async function guardarCita(payload: FormularioCitaEscritorio) {
  citaStore.limpiarMensajes()

  if (payload.personal_id === null || payload.cliente_id === null) {
    citaStore.error = 'Selecciona cliente y personal'
    return
  }

  const detallesValidos = payload.detalles
    .filter((detalle) => detalle.servicio_id !== null)
    .map((detalle) => ({
      servicio_id: Number(detalle.servicio_id),
      subtotal: Number(detalle.subtotal),
    }))

  const payloadFinal: CitaEscritorioPayload = {
    total: Number(payload.total),
    personal_id: Number(payload.personal_id),
    hora_c: payload.hora_c,
    fecha_c: payload.fecha_c,
    estado: payload.estado,
    cliente_id: Number(payload.cliente_id),
    detalles: detallesValidos,
  }

  try {
    await citaStore.crearCita(payloadFinal)
    limpiarFormulario()
  } catch (error) {
    console.error('Error al guardar cita:', error)
  }
}

function limpiarFormulario() {
  modeloFormulario.value = crearFormularioVacio()
}
</script>

<template>
  <main class="citas-page">
    <div class="page-gradient"></div>
    <div class="page-pattern"></div>
    <div class="page-glow glow-1"></div>
    <div class="page-glow glow-2"></div>

    <section class="hero-strip">
      <div class="hero-copy">
        <span class="panel-tag">Recepción</span>
        <h1>Cita de escritorio</h1>
        <p>
          Registra nuevas citas desde recepción de forma rápida, clara y ordenada
          dentro de un flujo más visual y cómodo para el personal.
        </p>
      </div>

      <div class="hero-stats">
        <article class="stat-card">
          <strong>{{ clienteStore.clientes.length }}</strong>
          <span>Clientes disponibles</span>
        </article>

        <article class="stat-card">
          <strong>{{ personalStore.personales.length }}</strong>
          <span>Personal disponible</span>
        </article>

        <article class="stat-card">
          <strong>{{ tipoServicioStore.tipoServicios.length }}</strong>
          <span>Servicios disponibles</span>
        </article>
      </div>
    </section>

    <section class="content-area">
      <div class="top-actions">
        <router-link to="/dashboard/personal" class="back-btn">
          ← Volver al dashboard
        </router-link>
      </div>

      <div class="workspace">
        <aside class="workspace-side">
          <div class="info-card">
            <span class="section-tag">Nueva cita</span>
            <h2>Organiza la agenda</h2>
            <p>
              Captura los datos del cliente, selecciona al personal disponible y
              agrega los servicios necesarios para registrar la cita correctamente.
            </p>
          </div>

          <div class="mini-stats">
            <article class="mini-stat">
              <strong>{{ clienteStore.clientes.length }}</strong>
              <span>Clientes</span>
            </article>

            <article class="mini-stat">
              <strong>{{ personalStore.personales.length }}</strong>
              <span>Personal</span>
            </article>

            <article class="mini-stat">
              <strong>{{ tipoServicioStore.tipoServicios.length }}</strong>
              <span>Servicios</span>
            </article>
          </div>
        </aside>

        <section class="workspace-main">
          <div class="header">
            <h2>Nueva cita de escritorio</h2>
            <p>Completa la información para registrar la cita.</p>
          </div>

          <div v-if="citaStore.error" class="alert error">
            {{ citaStore.error }}
          </div>

          <div v-if="citaStore.mensaje" class="alert success">
            {{ citaStore.mensaje }}
          </div>

          <div v-if="clienteStore.error" class="alert error">
            {{ clienteStore.error }}
          </div>

          <div v-if="personalStore.error" class="alert error">
            {{ personalStore.error }}
          </div>

          <div v-if="tipoServicioStore.error" class="alert error">
            {{ tipoServicioStore.error }}
          </div>

          <div class="form-shell">
            <div class="form-shell-header">
              <div>
                <h3>Formulario de cita</h3>
                <span>Captura los datos necesarios</span>
              </div>
            </div>

            <CitaEscritorioForm
              :modelo="modeloFormulario"
              :editando="false"
              :loading="
                citaStore.loading ||
                clienteStore.loading ||
                personalStore.loading ||
                tipoServicioStore.cargando
              "
              :clientes="clienteStore.clientes"
              :personales="personalStore.personales"
              :servicios="tipoServicioStore.tipoServicios"
              @submit="guardarCita"
            />
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.citas-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(204, 213, 174, 0.95), transparent 22%),
    radial-gradient(circle at 85% 20%, rgba(233, 237, 201, 0.72), transparent 20%),
    radial-gradient(circle at bottom right, rgba(212, 163, 115, 0.18), transparent 22%),
    linear-gradient(145deg, #fefae0 0%, #f7f1de 42%, #e9edc9 100%);
  color: #5f4b3a;
}

.page-gradient {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0));
  pointer-events: none;
}

.page-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.16) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.18), transparent 60%);
  pointer-events: none;
}

.page-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(46px);
  pointer-events: none;
}

.glow-1 {
  top: 80px;
  left: -100px;
  width: 260px;
  height: 260px;
  background: rgba(212, 163, 115, 0.12);
}

.glow-2 {
  right: -120px;
  bottom: 120px;
  width: 320px;
  height: 320px;
  background: rgba(204, 213, 174, 0.32);
}

.hero-strip {
  position: relative;
  z-index: 1;
  width: min(1480px, calc(100% - 48px));
  margin: 0 auto;
  padding: 48px 0 22px;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  gap: 22px;
  animation: pageEnter 0.8s ease;
}

.hero-copy {
  padding: 18px 0;
}

.panel-tag {
  display: inline-block;
  width: fit-content;
  margin-bottom: 18px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.38);
  color: #6d5844;
  font-weight: 800;
  font-size: 0.95rem;
  backdrop-filter: blur(8px);
}

.hero-copy h1 {
  margin: 0 0 16px;
  font-size: clamp(2.6rem, 5vw, 4.2rem);
  line-height: 0.98;
  color: #5f4b3a;
}

.hero-copy p {
  margin: 0;
  max-width: 760px;
  color: #7b6a58;
  line-height: 1.8;
  font-size: 1rem;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  align-self: end;
}

.stat-card {
  padding: 22px 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
  backdrop-filter: blur(12px);
}

.stat-card:nth-child(2) {
  background: rgba(204, 213, 174, 0.34);
  border: 1px solid rgba(169, 184, 130, 0.22);
}

.stat-card strong {
  display: block;
  margin-bottom: 8px;
  font-size: 1.9rem;
  color: #5f4b3a;
}

.stat-card span {
  color: #7b6a58;
  font-weight: 700;
  line-height: 1.5;
}

.content-area {
  position: relative;
  z-index: 1;
  width: min(1480px, calc(100% - 48px));
  margin: 0 auto;
  padding: 10px 0 48px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.top-actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.back-btn {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 0.95rem;
  text-decoration: none;
  transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
  background: rgba(204, 213, 174, 0.55);
  color: #556246;
  border: 1px solid rgba(169, 184, 130, 0.2);
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.08);
  backdrop-filter: blur(8px);
}

.back-btn:hover {
  transform: translateY(-2px);
  background: rgba(204, 213, 174, 0.78);
  box-shadow: 0 14px 24px rgba(92, 75, 59, 0.12);
}

.workspace {
  display: grid;
  grid-template-columns: minmax(280px, 0.58fr) minmax(0, 1.42fr);
  gap: 22px;
  align-items: start;
}

.workspace-side,
.workspace-main {
  display: grid;
  gap: 18px;
}

.info-card,
.form-shell {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 24px;
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(12px);
}

.info-card h2 {
  margin: 0 0 10px;
  font-size: 1.9rem;
  color: #5f4b3a;
}

.info-card p {
  margin: 0;
  color: #7b6a58;
  line-height: 1.8;
}

.section-tag {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.16);
  color: #8d633c;
  font-size: 0.82rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.mini-stats {
  display: grid;
  gap: 14px;
}

.mini-stat {
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(233, 237, 201, 0.32) 0%, rgba(255, 255, 255, 0.18) 100%);
  border: 1px solid rgba(204, 213, 174, 0.2);
  box-shadow: 0 10px 22px rgba(92, 75, 59, 0.06);
}

.mini-stat strong {
  display: block;
  margin-bottom: 6px;
  font-size: 1.7rem;
  color: #5f4b3a;
}

.mini-stat span {
  color: #6d7d55;
  font-weight: 700;
}

.header {
  display: grid;
  gap: 0.35rem;
}

.header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #5f4b3a;
}

.header p {
  margin: 0;
  color: #8a7764;
  font-size: 0.95rem;
}

.form-shell-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.form-shell-header h3 {
  margin: 0 0 4px;
  font-size: 1.35rem;
  color: #5f4b3a;
}

.form-shell-header span {
  color: #8a7764;
  font-weight: 700;
  font-size: 0.95rem;
}

.alert {
  padding: 0.95rem 1rem;
  border-radius: 14px;
  font-weight: 700;
}

.alert.error {
  background: rgba(255, 228, 228, 0.9);
  color: #991b1b;
  border: 1px solid rgba(245, 188, 188, 0.9);
}

.alert.success {
  background: rgba(204, 213, 174, 0.35);
  color: #3f5b2d;
  border: 1px solid rgba(189, 232, 200, 0.8);
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1250px) {
  .hero-strip,
  .workspace {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .hero-strip,
  .content-area {
    width: min(100% - 28px, 1480px);
    margin-left: auto;
    margin-right: auto;
  }

  .hero-strip {
    padding-top: 28px;
    gap: 18px;
  }

  .hero-copy h1 {
    font-size: 2.4rem;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }

  .info-card,
  .form-shell {
    padding: 18px;
    border-radius: 22px;
  }

  .header h2 {
    font-size: 1.5rem;
  }
}
</style>