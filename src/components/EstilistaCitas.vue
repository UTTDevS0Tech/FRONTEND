<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { usePersonalCitasStore } from '@/stores/estilistaCita'
import type { EstilistaCita } from '@/types'

const store = usePersonalCitasStore()

const filtroDia = ref('')
const filtroMes = ref('')
const filtroAnio = ref('')

const meses = [
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
]

const totalMostrado = computed(() => store.citasFuturas.length + store.citasPasadas.length)

onMounted(() => {
  aplicarFiltros()
})

function aplicarFiltros() {
  store.obtenerCitasDePersonal({
    dia: filtroDia.value,
    mes: filtroMes.value,
    anio: filtroAnio.value,
  })
}

function limpiarFiltros() {
  filtroDia.value = ''
  filtroMes.value = ''
  filtroAnio.value = ''
  aplicarFiltros()
}

function claseEstado(estado: string) {
  return `estado-${estado}`
}

function normalizarFecha(valor?: string | null) {
  return valor ? valor.slice(0, 10) : ''
}

function normalizarHora(valor?: string | null) {
  return valor ? valor.slice(0, 5) : '00:00'
}

function formatearFecha(fecha: string) {
  const fechaNormalizada = normalizarFecha(fecha)

  if (!fechaNormalizada) {
    return 'Fecha no disponible'
  }

  const [anio, mes, dia] = fechaNormalizada.split('-')
  return `${dia}/${mes}/${anio}`
}

function formatearHora(hora?: string | null) {
  return normalizarHora(hora)
}

function keyCita(prefijo: string, cita: EstilistaCita) {
  return `${prefijo}-${cita.cita_id}`
}
</script>

<template>
  <div class="agenda-content-inner">
    <div class="detalles-header">
      <div>
        <h3>Mi Agenda de Trabajo</h3>
        <p>Revisa aqui tus citas y filtralas por fecha.</p>
      </div>

      <span>{{ totalMostrado }} citas visibles</span>
    </div>

    <div class="filtros-panel">
      <div class="filtros-grid">
        <label class="campo-filtro">
          <span>Dia</span>
          <input v-model="filtroDia" type="number" min="1" max="31" placeholder="Todos" />
        </label>

        <label class="campo-filtro">
          <span>Mes</span>
          <select v-model="filtroMes">
            <option value="">Todos</option>
            <option v-for="mes in meses" :key="mes.value" :value="mes.value">
              {{ mes.label }}
            </option>
          </select>
        </label>

        <label class="campo-filtro">
          <span>Anio</span>
          <input v-model="filtroAnio" type="number" min="2000" placeholder="Todos" />
        </label>
      </div>

      <div class="acciones-filtros">
        <button type="button" class="primary-btn" @click="aplicarFiltros">
          Aplicar filtros
        </button>

        <button type="button" class="secondary-btn" @click="limpiarFiltros">
          Limpiar filtros
        </button>
      </div>
    </div>

    <div v-if="store.cargando" class="info-box mt-4">
      Consultando tu agenda, esperame tantito...
    </div>

    <div v-else-if="store.mensajeError" class="info-box error-box mt-4">
      {{ store.mensajeError }}
    </div>

    <template v-else>
      <section class="bloque-agenda">
        <div class="bloque-header">
          <div>
            <h4>Futuras</h4>
            <p>Pendientes y confirmadas por atender.</p>
          </div>
          <span>{{ store.citasFuturas.length }}</span>
        </div>

        <div v-if="store.citasFuturas.length" class="servicios-grid">
          <div
            v-for="cita in store.citasFuturas"
            :key="keyCita('futura', cita)"
            class="servicio-card"
            :class="[claseEstado(cita.estado)]"
          >
            <div class="flex-row">
              <span class="servicio-nombre">{{ cita.nombre_cliente }}</span>
              <span class="badge" :class="claseEstado(cita.estado)">
                {{ cita.estado }}
              </span>
            </div>

            <div class="cita-info">
              <strong>{{ formatearHora(cita.hora_c) }} - {{ formatearHora(cita.hora_fin) }}</strong>
              <p>{{ formatearFecha(cita.fecha_c) }}</p>
            </div>

            <div class="total-row mt-2">
              <span>Cobro:</span>
              <strong class="servicio-precio">${{ cita.total }}</strong>
            </div>
          </div>
        </div>

        <div v-else class="info-box mt-4">
          No hay citas futuras con los filtros aplicados.
        </div>
      </section>

      <section class="bloque-agenda">
        <div class="bloque-header">
          <div>
            <h4>Pasadas</h4>
            <p>Canceladas o completadas segun la clasificacion del backend.</p>
          </div>
          <span>{{ store.citasPasadas.length }}</span>
        </div>

        <div v-if="store.citasPasadas.length" class="servicios-grid">
          <div
            v-for="cita in store.citasPasadas"
            :key="keyCita('pasada', cita)"
            class="servicio-card"
            :class="[claseEstado(cita.estado)]"
          >
            <div class="flex-row">
              <span class="servicio-nombre">{{ cita.nombre_cliente }}</span>
              <span class="badge" :class="claseEstado(cita.estado)">
                {{ cita.estado }}
              </span>
            </div>

            <div class="cita-info">
              <strong>{{ formatearHora(cita.hora_c) }} - {{ formatearHora(cita.hora_fin) }}</strong>
              <p>{{ formatearFecha(cita.fecha_c) }}</p>
            </div>

            <div class="total-row mt-2">
              <span>Cobro:</span>
              <strong class="servicio-precio">${{ cita.total }}</strong>
            </div>
          </div>
        </div>

        <div v-else class="info-box mt-4">
          No hay citas pasadas con los filtros aplicados.
        </div>
      </section>

      <div
        v-if="!store.citasFuturas.length && !store.citasPasadas.length"
        class="info-box mt-4"
      >
        No se encontraron citas para los filtros seleccionados.
      </div>
    </template>
  </div>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.agenda-content-inner {
  display: grid;
  gap: 1rem;
}

.detalles-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.detalles-header h3 {
  margin: 0 0 0.35rem;
  color: #5f4b3a;
  font-size: 1.35rem;
}

.detalles-header p {
  margin: 0;
  color: #8a7764;
  font-size: 0.95rem;
}

.detalles-header span {
  color: #8a7764;
  font-weight: 800;
  font-size: 0.95rem;
}

.filtros-panel {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(212, 163, 115, 0.18);
  box-shadow: 0 12px 24px rgba(92, 75, 59, 0.05);
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(140px, 1fr));
  gap: 12px;
  flex: 1;
}

.campo-filtro {
  display: grid;
  gap: 6px;
  color: #6c5743;
  font-size: 0.88rem;
  font-weight: 800;
}

.campo-filtro input,
.campo-filtro select {
  width: 100%;
  border: 1px solid rgba(212, 163, 115, 0.24);
  border-radius: 14px;
  padding: 12px 14px;
  background: rgba(250, 237, 205, 0.26);
  color: #5f4b3a;
  font-size: 0.95rem;
}

.campo-filtro input:focus,
.campo-filtro select:focus {
  outline: 2px solid rgba(212, 163, 115, 0.25);
  border-color: #d4a373;
}

.acciones-filtros {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn {
  padding: 12px 18px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 900;
  font-size: 0.95rem;
  transition: transform 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease;
}

.primary-btn {
  background: #d4a373;
  color: #fffaf4;
  box-shadow: 0 12px 24px rgba(212, 163, 115, 0.24);
}

.secondary-btn {
  background: rgba(204, 213, 174, 0.58);
  color: #5f4b3a;
  box-shadow: 0 12px 24px rgba(179, 192, 136, 0.2);
}

.primary-btn:hover,
.secondary-btn:hover {
  transform: translateY(-2px);
}

.bloque-agenda {
  display: grid;
  gap: 1rem;
}

.bloque-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.bloque-header h4 {
  margin: 0 0 0.25rem;
  color: #5f4b3a;
  font-size: 1.1rem;
}

.bloque-header p {
  margin: 0;
  color: #8a7764;
  font-size: 0.92rem;
}

.bloque-header span {
  min-width: 44px;
  text-align: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(250, 237, 205, 0.7);
  color: #7a6048;
  font-weight: 800;
}

.flex-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.cita-info {
  font-size: 0.92rem;
  color: #8a7764;
  margin: 8px 0;
  display: grid;
  gap: 6px;
}

.cita-info p,
.cita-info strong {
  margin: 0;
}

.badge {
  font-size: 0.72rem;
  padding: 6px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  font-weight: 800;
  white-space: nowrap;
}

.badge.estado-pendiente {
  background: rgba(250, 237, 205, 0.95);
  color: #9b6a3b;
}

.badge.estado-confirmada {
  background: rgba(204, 213, 174, 0.45);
  color: #536437;
}

.badge.estado-cancelada {
  background: rgba(255, 226, 226, 0.95);
  color: #ae4d4d;
}

.badge.estado-completada {
  background: rgba(220, 232, 250, 0.92);
  color: #355886;
}

.servicios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.servicio-card {
  border-radius: 22px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(212, 163, 115, 0.18);
  box-shadow: 0 12px 24px rgba(92, 75, 59, 0.08);
  display: grid;
  gap: 10px;
}

.servicio-card.estado-pendiente {
  border-left: 5px solid #d4a373;
}

.servicio-card.estado-confirmada {
  border-left: 5px solid #ccd5ae;
}

.servicio-card.estado-cancelada {
  border-left: 5px solid #e8b4b4;
}

.servicio-card.estado-completada {
  border-left: 5px solid #b7c9e8;
}

.servicio-nombre {
  color: #5f4b3a;
  font-weight: 800;
  font-size: 1rem;
}

.servicio-precio {
  color: #8d633c;
  font-size: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  color: #5f4b3a;
}

.info-box {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(250, 237, 205, 0.45);
  color: #7c6856;
  border: 1px dashed rgba(212, 163, 115, 0.24);
  font-weight: 600;
}

.error-box {
  background: rgba(255, 228, 228, 0.9);
  color: #a14444;
  border: 1px solid rgba(161, 68, 68, 0.14);
}

.mt-4 {
  margin-top: 1rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

@media (max-width: 700px) {
  .detalles-header,
  .bloque-header,
  .filtros-panel,
  .acciones-filtros {
    flex-direction: column;
    align-items: stretch;
  }

  .filtros-grid {
    grid-template-columns: 1fr;
  }
}
</style>
