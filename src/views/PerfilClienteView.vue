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
  if (!valor) {
    return 'Fecha pendiente'
  }

  const partes = valor.slice(0, 10).split('-')
  const anio = Number(partes[0])
  const mes = Number(partes[1])
  const dia = Number(partes[2])

  if (!anio || !mes || !dia) {
    return valor
  }

  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(anio, mes - 1, dia))
}

function formatearHora(valor?: string | null) {
  const horaNormalizada = normalizarHora(valor)

  if (!horaNormalizada) {
    return 'Por definir'
  }

  const partes = horaNormalizada.split(':')
  const hora = Number(partes[0])
  const minuto = Number(partes[1])

  if (Number.isNaN(hora) || Number.isNaN(minuto)) {
    return horaNormalizada
  }

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
  if (!cita.detalles?.length) {
    return 'Sin servicios registrados'
  }

  return cita.detalles.map((detalle) => detalle.servicio || 'Servicio').join(', ')
}

function totalTexto(cita: PerfilClienteCita) {
  if (cita.total === null || cita.total === undefined || cita.total === '') {
    return 'Por definir'
  }

  const total = Number(cita.total)

  if (Number.isNaN(total)) {
    return String(cita.total)
  }

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
    <section class="perfil-shell">
      <div class="top-actions">
        <button type="button" class="ghost-btn" @click="router.push('/dashboard/cliente')">
          Volver al dashboard
        </button>

        <button type="button" class="primary-btn" @click="router.push('/dashboard/cliente/cita')">
          Agendar nueva cita
        </button>
      </div>

      <section class="hero-card">
        <div class="hero-copy">
          <span class="hero-tag">Mi perfil</span>
          <h1>{{ bienvenida }}</h1>
          <p>
            Desde aqui puedes revisar tu historial, ver tus proximas citas y abrir
            ajustes solo cuando necesites editar tus datos.
          </p>
        </div>

        <div class="hero-stats">
          <article class="stat-card">
            <strong>{{ perfilStore.citasPendientes.length }}</strong>
            <span>Citas pendientes</span>
          </article>

          <article class="stat-card">
            <strong>{{ perfilStore.citasPasadas.length }}</strong>
            <span>Citas pasadas</span>
          </article>
        </div>
      </section>

      <div class="layout">
        <section class="info-card">
          <div class="section-head">
            <div>
              <span class="section-tag">Mi informacion</span>
              <h2>Datos personales</h2>
            </div>

            <div class="settings-wrap">
              <p>Abre ajustes para editar tu perfil o cerrar sesion.</p>

              <div class="settings-menu">
                <button type="button" class="ghost-btn settings-btn" @click="toggleAjustes">
                  Ajustes
                </button>

                <div v-if="mostrarAjustes" class="settings-dropdown">
                  <button type="button" class="settings-option" @click="abrirEdicionPerfil">
                    Editar datos del perfil
                  </button>

                  <button type="button" class="settings-option danger" @click="cerrarSesion">
                    Cerrar sesion
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
              <span>Correo electronico</span>
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
                <label>Correo electronico</label>
                <input v-model="formulario.email" type="email" autocomplete="email" />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="ghost-btn wide" @click="cancelarEdicion">
                Cancelar
              </button>

              <button type="submit" class="primary-btn wide" :disabled="perfilStore.loadingPerfil">
                {{ perfilStore.loadingPerfil ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </div>
          </form>
        </section>

        <section class="timeline-column">
          <article class="timeline-card">
            <div class="section-head compact">
              <div>
                <span class="section-tag">Agenda activa</span>
                <h2>Citas pendientes</h2>
              </div>
              <p>Tus proximos espacios reservados y citas aun vigentes.</p>
            </div>

            <div v-if="perfilStore.loadingCitas" class="empty-state loading">
              Cargando tus citas...
            </div>

            <div v-else-if="perfilStore.errorCitas" class="alert error">
              {{ perfilStore.errorCitas }}
            </div>

            <div v-else-if="perfilStore.citasPendientes.length === 0" class="empty-state">
              No tienes citas pendientes por ahora.
            </div>

            <div v-else class="cards-grid">
              <article
                v-for="cita in perfilStore.citasPendientes"
                :key="`pendiente-${cita.id}`"
                class="cita-card"
              >
                <div class="cita-top">
                  <div>
                    <h3>Cita #{{ cita.id }}</h3>
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

          <article class="timeline-card">
            <div class="section-head compact">
              <div>
                <span class="section-tag">Historial</span>
                <h2>Citas pasadas</h2>
              </div>
              <p>Aqui veras las citas que ya vencieron o fueron canceladas.</p>
            </div>

            <div v-if="perfilStore.loadingCitas" class="empty-state loading">
              Cargando tus citas...
            </div>

            <div v-else-if="perfilStore.errorCitas" class="alert error">
              {{ perfilStore.errorCitas }}
            </div>

            <div v-else-if="perfilStore.citasPasadas.length === 0" class="empty-state">
              Aun no tienes citas en tu historial.
            </div>

            <div v-else class="cards-grid">
              <article
                v-for="cita in perfilStore.citasPasadas"
                :key="`pasada-${cita.id}`"
                class="cita-card muted"
              >
                <div class="cita-top">
                  <div>
                    <h3>Cita #{{ cita.id }}</h3>
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
  min-height: 100vh;
  padding: 28px;
  background:
    radial-gradient(circle at top left, rgba(204, 213, 174, 0.6), transparent 28%),
    linear-gradient(135deg, #fefae0 0%, #faedcd 55%, #e9edc9 100%);
  color: #5f4b3a;
}

.perfil-shell {
  width: min(1480px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 22px;
  animation: pageEnter 0.7s ease;
}

.top-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-card,
.info-card,
.timeline-card {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 0 20px 45px rgba(92, 75, 59, 0.12);
  backdrop-filter: blur(14px);
}

.hero-card {
  border-radius: 32px;
  padding: 28px;
  display: grid;
  grid-template-columns: 1.5fr minmax(260px, 0.85fr);
  gap: 18px;
  align-items: stretch;
}

.hero-copy {
  display: grid;
  gap: 12px;
}

.hero-copy h1,
.hero-copy p {
  margin: 0;
}

.hero-copy h1 {
  font-size: clamp(2.1rem, 4vw, 3.4rem);
  line-height: 1.02;
}

.hero-copy p {
  max-width: 760px;
  color: #7b6a58;
  line-height: 1.8;
}

.hero-tag,
.section-tag {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(204, 213, 174, 0.34);
  color: #6d5844;
  font-weight: 800;
  font-size: 0.92rem;
}

.hero-stats {
  display: grid;
  gap: 14px;
}

.stat-card {
  border-radius: 24px;
  padding: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(250, 237, 205, 0.82));
  display: grid;
  gap: 8px;
  justify-items: start;
}

.stat-card strong {
  font-size: 2.3rem;
  line-height: 1;
}

.stat-card span {
  color: #7b6a58;
  font-weight: 700;
}

.layout {
  display: grid;
  grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.35fr);
  gap: 22px;
  align-items: start;
}

.info-card,
.timeline-card {
  border-radius: 30px;
  padding: 24px;
}

.timeline-column {
  display: grid;
  gap: 22px;
}

.section-head {
  display: grid;
  gap: 10px;
  margin-bottom: 18px;
}

.section-head.compact {
  margin-bottom: 16px;
}

.section-head h2,
.section-head p {
  margin: 0;
}

.section-head h2 {
  font-size: 1.7rem;
}

.section-head p {
  color: #8a7764;
  line-height: 1.7;
}

.settings-wrap {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.settings-menu {
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
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(212, 163, 115, 0.14);
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
}

.field input {
  width: 100%;
  min-width: 0;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(212, 163, 115, 0.24);
  background: rgba(255, 255, 255, 0.94);
  color: #5f4b3a;
  outline: none;
  transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
}

.field input:focus {
  border-color: #d4a373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
  transform: translateY(-1px);
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
  border-radius: 22px;
  padding: 18px;
  background: rgba(254, 250, 224, 0.7);
  border: 1px solid rgba(212, 163, 115, 0.18);
  display: grid;
  gap: 14px;
}

.cita-card.muted {
  background: rgba(255, 255, 255, 0.62);
}

.cita-top {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
}

.cita-top h3,
.cita-top p {
  margin: 0;
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
}

.cita-meta dt {
  color: #8a7764;
  font-weight: 700;
}

.cita-meta dd {
  margin: 0;
  font-weight: 700;
  line-height: 1.5;
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

.ghost-btn,
.primary-btn {
  border: none;
  border-radius: 16px;
  padding: 12px 18px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

.ghost-btn {
  background: rgba(255, 255, 255, 0.72);
  color: #5f4b3a;
  box-shadow: 0 10px 22px rgba(92, 75, 59, 0.08);
}

.ghost-btn:hover,
.primary-btn:hover {
  transform: translateY(-2px);
}

.primary-btn {
  background: #d4a373;
  color: white;
  box-shadow: 0 14px 28px rgba(212, 163, 115, 0.26);
}

.primary-btn.wide,
.ghost-btn.wide {
  width: 100%;
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: wait;
  transform: none;
}

.alert,
.empty-state {
  border-radius: 18px;
  padding: 14px 16px;
  font-weight: 700;
}

.alert.error {
  margin-bottom: 14px;
  background: rgba(255, 228, 228, 0.95);
  color: #9d3e3e;
}

.alert.success {
  margin-bottom: 14px;
  background: rgba(204, 213, 174, 0.38);
  color: #436132;
}

.empty-state {
  background: rgba(255, 255, 255, 0.68);
  color: #7b6a58;
  border: 1px dashed rgba(212, 163, 115, 0.28);
}

.empty-state.loading {
  background: rgba(250, 237, 205, 0.55);
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1120px) {
  .layout,
  .hero-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .perfil-page {
    padding: 16px;
  }

  .grid,
  .cita-meta,
  .form-actions {
    grid-template-columns: 1fr;
  }

  .cita-top,
  .top-actions,
  .summary-row,
  .settings-wrap {
    flex-direction: column;
    align-items: stretch;
  }

  .ghost-btn,
  .primary-btn {
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
}
</style>
