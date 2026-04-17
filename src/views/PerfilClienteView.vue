<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePerfilStore } from '@/stores/perfil'
import type { PerfilClienteCita } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const perfilStore = usePerfilStore()

const mostrarAjustes = ref(false)
const mostrarFormularioEdicion = ref(false)

const formulario = reactive({
  nom: '',
  apellido_p: '',
  apellido_m: '',
  email: '',
})

const bienvenida = computed(() => `Bienvenido(a) ${perfilStore.nombreCompleto}`)

function hidratarFormulario() {
  const datos = perfilStore.construirFormulario()
  formulario.nom = datos.nom
  formulario.apellido_p = datos.apellido_p
  formulario.apellido_m = datos.apellido_m
  formulario.email = datos.email
}

function normalizarHora(valor?: string | null) {
  return valor ? valor.slice(0, 5) : ''
}

function formatearFecha(valor: string) {
  if (!valor) return 'Fecha pendiente'

  const partes = valor.slice(0, 10).split('-')
  const anio = Number(partes[0])
  const mes = Number(partes[1])
  const dia = Number(partes[2])

  if (!anio || !mes || !dia) return valor

  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(anio, mes - 1, dia))
}

function formatearHora(valor?: string | null) {
  const horaNormalizada = normalizarHora(valor)

  if (!horaNormalizada) return 'Por definir'

  const partes = horaNormalizada.split(':')
  const hora = Number(partes[0])
  const minuto = Number(partes[1])

  if (Number.isNaN(hora) || Number.isNaN(minuto)) return horaNormalizada

  const fecha = new Date()
  fecha.setHours(hora, minuto, 0, 0)

  return new Intl.DateTimeFormat('es-MX', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(fecha)
}

function resumenHorario(cita: PerfilClienteCita) {
  const inicio = formatearHora(cita.hora_c)
  const fin = cita.hora_fin ? formatearHora(cita.hora_fin) : ''
  return fin ? `${inicio} - ${fin}` : inicio
}

function serviciosTexto(cita: PerfilClienteCita) {
  if (!cita.detalles?.length) return 'Sin servicios registrados'
  return cita.detalles.map((detalle) => detalle.servicio || 'Servicio').join(', ')
}

function totalTexto(cita: PerfilClienteCita) {
  if (cita.total === null || cita.total === undefined || cita.total === '') {
    return 'Por definir'
  }

  const total = Number(cita.total)
  if (Number.isNaN(total)) return String(cita.total)

  return `$${total.toFixed(2)}`
}

function claseEstado(estado: PerfilClienteCita['estado']) {
  return `estado-${estado}`
}

function toggleAjustes() {
  mostrarAjustes.value = !mostrarAjustes.value
}

function abrirEdicionPerfil() {
  mostrarFormularioEdicion.value = true
  mostrarAjustes.value = false
  hidratarFormulario()
}

function cancelarEdicion() {
  mostrarFormularioEdicion.value = false
  hidratarFormulario()
}

function cerrarSesion() {
  authStore.logout()
  router.push('/login')
}

async function cargarPerfilYCitas() {
  const resultados = await Promise.allSettled([
    perfilStore.obtenerPerfil(),
    perfilStore.obtenerMisCitas(),
  ])

  if (resultados[0].status === 'fulfilled') {
    hidratarFormulario()
  }
}

async function guardarCambios() {
  await perfilStore.actualizarPerfil({
    nom: formulario.nom,
    apellido_p: formulario.apellido_p,
    apellido_m: formulario.apellido_m,
    email: formulario.email,
  })

  hidratarFormulario()
  mostrarFormularioEdicion.value = false
  mostrarAjustes.value = false
}

onMounted(async () => {
  await cargarPerfilYCitas()
})
</script>

<template>
  <main class="perfil-page">
    <div class="page-gradient"></div>
    <div class="page-pattern"></div>
    <div class="page-glow glow-1"></div>
    <div class="page-glow glow-2"></div>

    <section class="hero-strip">
      <div class="hero-copy">
        <span class="panel-tag">Cliente</span>
        <h1>Mi perfil</h1>
        <p>
          Revisa tu información personal, consulta tus próximas citas y mantén
          tu historial organizado desde una sola pantalla.
        </p>
      </div>
    </section>

    <section class="content-area">
      <div class="top-actions">
        <button type="button" class="back-btn" @click="router.push('/dashboard/cliente')">
          ← Volver al dashboard
        </button>

        <button type="button" class="new-btn" @click="router.push('/dashboard/cliente/cita')">
          + Agendar nueva cita
        </button>
      </div>

      <section class="hero-card">
        <div class="hero-copy-block">
          <span class="hero-tag">Mi perfil</span>
          <h2>{{ bienvenida }}</h2>
          <p>
            Desde aquí puedes revisar tu historial, ver tus próximas citas y
            abrir ajustes solo cuando necesites editar tus datos.
          </p>
        </div>
      </section>

      <div class="content-grid">
        <section class="content-card info-card">
          <div class="section-head">
            <div>
              <span class="section-tag">Información</span>
              <h3>Datos personales</h3>
              <p>Administra tu información de perfil y opciones de cuenta.</p>
            </div>

            <div class="settings-wrap">
              <div class="settings-menu">
                <button type="button" class="ghost-btn settings-btn" @click="toggleAjustes">
                  Ajustes
                </button>

                <div v-if="mostrarAjustes" class="settings-dropdown">
                  <button type="button" class="settings-option" @click="abrirEdicionPerfil">
                    Editar datos del perfil
                  </button>

                  <button type="button" class="settings-option danger" @click="cerrarSesion">
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="perfilStore.errorPerfil" class="alert error">
            {{ perfilStore.errorPerfil }}
          </div>

          <div v-if="perfilStore.mensaje" class="alert success">
            {{ perfilStore.mensaje }}
          </div>

          <div v-if="!mostrarFormularioEdicion" class="profile-summary">
            <div class="summary-row">
              <span>Nombre</span>
              <strong>{{ formulario.nom || 'Sin definir' }}</strong>
            </div>

            <div class="summary-row">
              <span>Apellido paterno</span>
              <strong>{{ formulario.apellido_p || 'Sin definir' }}</strong>
            </div>

            <div class="summary-row">
              <span>Apellido materno</span>
              <strong>{{ formulario.apellido_m || 'Sin definir' }}</strong>
            </div>

            <div class="summary-row">
              <span>Correo electrónico</span>
              <strong>{{ formulario.email || 'Sin definir' }}</strong>
            </div>
          </div>

          <form v-else class="perfil-form" @submit.prevent="guardarCambios">
            <div class="grid">
              <div class="field">
                <label>Nombre</label>
                <input v-model="formulario.nom" type="text" autocomplete="given-name" />
              </div>

              <div class="field">
                <label>Apellido paterno</label>
                <input v-model="formulario.apellido_p" type="text" autocomplete="family-name" />
              </div>

              <div class="field">
                <label>Apellido materno</label>
                <input v-model="formulario.apellido_m" type="text" />
              </div>

              <div class="field">
                <label>Correo electrónico</label>
                <input v-model="formulario.email" type="email" autocomplete="email" />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="ghost-btn wide" @click="cancelarEdicion">
                Cancelar
              </button>

              <button type="submit" class="new-btn wide" :disabled="perfilStore.loadingPerfil">
                {{ perfilStore.loadingPerfil ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </div>
          </form>
        </section>

        <section class="timeline-column">
          <article class="content-card">
            <div class="section-head compact">
              <div>
                <span class="section-tag">Historial</span>
                <h3>Citas pasadas</h3>
              </div>
              <p>Aquí verás las citas que ya vencieron o fueron canceladas.</p>
            </div>

            <div v-if="perfilStore.loadingCitas" class="empty-state loading">
              Cargando tus citas...
            </div>

            <div v-else-if="perfilStore.errorCitas" class="alert error">
              {{ perfilStore.errorCitas }}
            </div>

            <div v-else-if="perfilStore.citasPasadas.length === 0" class="empty-state">
              Aún no tienes citas en tu historial.
            </div>

            <div v-else class="cards-grid">
              <article
                v-for="cita in perfilStore.citasPasadas"
                :key="`pasada-${cita.id}`"
                class="cita-card muted"
              >
                <div class="card-glow"></div>

                <div class="cita-top">
                  <div>
                    <h4>Cita #{{ cita.id }}</h4>
                    <p>{{ formatearFecha(cita.fecha_c) }}</p>
                  </div>

                  <span class="estado-pill" :class="claseEstado(cita.estado)">
                    {{ cita.estado }}
                  </span>
                </div>

                <dl class="cita-meta">
                  <div>
                    <dt>Horario</dt>
                    <dd>{{ resumenHorario(cita) }}</dd>
                  </div>
                  <div>
                    <dt>Estilista</dt>
                    <dd>{{ cita.personal || 'Sin asignar' }}</dd>
                  </div>
                  <div>
                    <dt>Servicios</dt>
                    <dd>{{ serviciosTexto(cita) }}</dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd>{{ totalTexto(cita) }}</dd>
                  </div>
                </dl>
              </article>
            </div>
          </article>
        </section>
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.perfil-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(204, 213, 174, 0.95), transparent 22%),
    radial-gradient(circle at 85% 20%, rgba(233, 237, 201, 0.7), transparent 20%),
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
  width: min(1440px, calc(100% - 48px));
  margin: 0 auto;
  padding: 48px 0 22px;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
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
  max-width: 720px;
  color: #7b6a58;
  line-height: 1.8;
  font-size: 1rem;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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

.stat-card:first-child {
  background: rgba(255, 255, 255, 0.28);
}

.stat-card:last-child {
  background: rgba(204, 213, 174, 0.34);
  border: 1px solid rgba(169, 184, 130, 0.22);
}

.stat-card strong {
  display: block;
  margin-bottom: 8px;
  font-size: 2rem;
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
  width: min(1440px, calc(100% - 48px));
  margin: 0 auto;
  padding: 10px 0 48px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.back-btn,
.new-btn,
.ghost-btn {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 0.95rem;
  border: none;
  text-decoration: none;
  transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  cursor: pointer;
}

.back-btn,
.ghost-btn {
  background: rgba(204, 213, 174, 0.55);
  color: #556246;
  border: 1px solid rgba(169, 184, 130, 0.2);
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.06);
  backdrop-filter: blur(8px);
}

.back-btn:hover,
.new-btn:hover,
.ghost-btn:hover {
  transform: translateY(-2px);
}

.back-btn:hover,
.ghost-btn:hover {
  background: rgba(204, 213, 174, 0.78);
  box-shadow: 0 14px 24px rgba(92, 75, 59, 0.1);
}

.new-btn {
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  box-shadow: 0 12px 24px rgba(212, 163, 115, 0.22);
}

.new-btn:disabled {
  opacity: 0.7;
  cursor: wait;
  transform: none;
}

.hero-card,
.content-card {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(12px);
}

.hero-copy-block {
  display: grid;
  gap: 10px;
}

.hero-copy-block h2,
.hero-copy-block p {
  margin: 0;
}

.hero-copy-block h2 {
  font-size: 1.9rem;
  color: #5f4b3a;
}

.hero-copy-block p {
  color: #8a7764;
  line-height: 1.7;
  max-width: 760px;
}

.hero-tag,
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
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.35fr);
  gap: 22px;
  align-items: start;
}

.timeline-column {
  display: grid;
  gap: 22px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.section-head.compact {
  margin-bottom: 16px;
}

.section-head h3,
.section-head p {
  margin: 0;
}

.section-head h3 {
  font-size: 1.45rem;
  color: #5f4b3a;
}

.section-head p {
  color: #8a7764;
  line-height: 1.6;
  max-width: 420px;
}

.settings-wrap {
  position: relative;
}

.settings-btn {
  min-width: 120px;
}

.settings-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 240px;
  padding: 10px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(212, 163, 115, 0.18);
  box-shadow: 0 18px 34px rgba(92, 75, 59, 0.14);
  display: grid;
  gap: 8px;
  z-index: 5;
}

.settings-option {
  border: none;
  border-radius: 14px;
  padding: 12px 14px;
  text-align: left;
  font-weight: 800;
  color: #5f4b3a;
  background: rgba(250, 237, 205, 0.42);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.settings-option:hover {
  transform: translateY(-1px);
  background: rgba(250, 237, 205, 0.7);
}

.settings-option.danger {
  background: rgba(255, 228, 228, 0.8);
  color: #9d3e3e;
}

.profile-summary {
  display: grid;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.34);
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.summary-row span {
  color: #8a7764;
  font-weight: 700;
}

.summary-row strong {
  text-align: right;
}

.perfil-form {
  display: grid;
  gap: 18px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.field {
  display: grid;
  gap: 8px;
}

.field label {
  font-weight: 800;
  color: #5f4b3a;
}

.field input {
  width: 100%;
  min-width: 0;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.2);
  background: rgba(255, 255, 255, 0.84);
  color: #5f4b3a;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s ease;
  font-family: inherit;
}

.field input:focus {
  border-color: #D4A373;
  box-shadow:
    0 0 0 4px rgba(212, 163, 115, 0.15),
    0 6px 12px rgba(212, 163, 115, 0.12);
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.96);
}

.form-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.cards-grid {
  display: grid;
  gap: 14px;
}

.cita-card {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.24);
  display: grid;
  gap: 14px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 24px rgba(92, 75, 59, 0.05);
}

.cita-card.muted {
  background: rgba(255, 255, 255, 0.28);
}

.card-glow {
  position: absolute;
  top: -34px;
  right: -16px;
  width: 110px;
  height: 110px;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.12);
  filter: blur(18px);
  pointer-events: none;
}

.cita-top {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
}

.cita-top h4,
.cita-top p {
  margin: 0;
}

.cita-top h4 {
  color: #5f4b3a;
  font-size: 1.1rem;
}

.cita-top p {
  margin-top: 4px;
  color: #8a7764;
  text-transform: capitalize;
}

.cita-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
}

.cita-meta div {
  display: grid;
  gap: 4px;
  padding: 0.85rem 0.95rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.cita-meta dt {
  color: #8a7764;
  font-weight: 700;
}

.cita-meta dd {
  margin: 0;
  font-weight: 700;
  line-height: 1.5;
  color: #5f4b3a;
}

.estado-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 999px;
  text-transform: capitalize;
  font-size: 0.88rem;
  font-weight: 900;
  white-space: nowrap;
}

.estado-pendiente {
  background: rgba(250, 237, 205, 0.95);
  color: #8d633c;
}

.estado-confirmada {
  background: rgba(204, 213, 174, 0.95);
  color: #48623b;
}

.estado-cancelada {
  background: rgba(255, 228, 228, 0.92);
  color: #9d3e3e;
}

.estado-completada {
  background: rgba(220, 232, 250, 0.92);
  color: #355886;
}

.alert,
.empty-state {
  border-radius: 18px;
  padding: 14px 16px;
  font-weight: 700;
}

.alert.error {
  margin-bottom: 14px;
  background: rgba(255, 228, 228, 0.86);
  color: #9d3e3e;
  border: 1px solid rgba(161, 68, 68, 0.14);
}

.alert.success {
  margin-bottom: 14px;
  background: rgba(204, 213, 174, 0.34);
  color: #436132;
  border: 1px solid rgba(169, 184, 130, 0.16);
}

.empty-state {
  background: rgba(255, 255, 255, 0.22);
  color: #7b6a58;
  border: 1px dashed rgba(212, 163, 115, 0.28);
  backdrop-filter: blur(10px);
}

.empty-state.loading {
  background: rgba(250, 237, 205, 0.34);
}

.wide {
  width: 100%;
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
  .content-grid {
    grid-template-columns: 1fr;
  }

  .hero-strip {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .perfil-page {
    padding: 0;
  }

  .hero-strip,
  .content-area {
    width: min(100% - 28px, 1440px);
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

  .hero-stats,
  .grid,
  .cita-meta,
  .form-actions {
    grid-template-columns: 1fr;
  }

  .hero-card,
  .content-card {
    padding: 18px;
    border-radius: 22px;
  }

  .top-actions,
  .summary-row,
  .cita-top,
  .section-head {
    flex-direction: column;
    align-items: stretch;
  }

  .back-btn,
  .new-btn,
  .ghost-btn {
    width: 100%;
  }

  .summary-row strong {
    text-align: left;
  }

  .settings-dropdown {
    position: static;
    width: 100%;
    margin-top: 10px;
  }

  .hero-copy-block h2 {
    font-size: 1.5rem;
  }
}
</style>