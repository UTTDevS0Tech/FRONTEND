<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { AdminHorario } from '@/types'

const props = defineProps<{
  modelValue?: AdminHorario[] | null
  cargando?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: { horarios: AdminHorario[] }): void
  (e: 'cancel'): void
}>()

const diasSemana = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
]

const horarios = reactive<AdminHorario[]>(
  diasSemana.map((dia) => ({
    dia_semana: dia,
    hora_inicio: '09:00',
    hora_fin: '18:00',
    activo: dia !== 'Domingo',
  }))
)

function normalizarHora(valor?: string | null) {
  return valor ? valor.slice(0, 5) : '09:00'
}

watch(
  () => props.modelValue,
  (valor) => {
    diasSemana.forEach((dia, indice) => {
      const horarioExistente = valor?.find((item) => item.dia_semana === dia)

      horarios[indice] = {
        id: horarioExistente?.id,
        personal_id: horarioExistente?.personal_id,
        dia_semana: dia,
        hora_inicio: normalizarHora(horarioExistente?.hora_inicio) || '09:00',
        hora_fin: normalizarHora(horarioExistente?.hora_fin) || '18:00',
        activo: horarioExistente?.activo ?? dia !== 'Domingo',
      }
    })
  },
  { immediate: true }
)

function guardarHorarios() {
  emit('submit', {
    horarios: horarios.map((horario) => ({
      ...horario,
      hora_inicio: normalizarHora(horario.hora_inicio),
      hora_fin: normalizarHora(horario.hora_fin),
    })),
  })
}

function cancelar() {
  emit('cancel')
}
</script>

<template>
  <div class="formulario-panel">
    <div class="form-intro">
      <span class="form-tag">Horario semanal</span>
      <h4>Configura la disponibilidad del estilista</h4>
      <p>
        Activa solo los días que trabaja y define un rango de hora claro para
        que la disponibilidad del sistema sea coherente.
      </p>
    </div>

    <form class="admin-form" @submit.prevent="guardarHorarios">
      <div class="horarios-grid">
        <div v-for="horario in horarios" :key="horario.dia_semana" class="horario-card">
          <div class="horario-head">
            <strong>{{ horario.dia_semana }}</strong>

            <label class="toggle-line">
              <input v-model="horario.activo" type="checkbox" />
              <span>{{ horario.activo ? 'Activo' : 'Descanso' }}</span>
            </label>
          </div>

          <div class="horario-fields">
            <div class="field">
              <label>Inicio</label>
              <input v-model="horario.hora_inicio" type="time" :disabled="!horario.activo" />
            </div>

            <div class="field">
              <label>Fin</label>
              <input v-model="horario.hora_fin" type="time" :disabled="!horario.activo" />
            </div>
          </div>
        </div>
      </div>

      <div class="acciones-formulario">
        <button type="submit" class="primary-btn" :disabled="cargando">
          {{ cargando ? 'Guardando...' : 'Guardar horario' }}
        </button>

        <button type="button" class="secondary-btn" :disabled="cargando" @click="cancelar">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.formulario-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-intro {
  padding: 18px 20px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(204, 213, 174, 0.35), rgba(250, 237, 205, 0.72));
  border: 1px solid rgba(212, 163, 115, 0.14);
}

.form-tag {
  display: inline-flex;
  width: fit-content;
  margin-bottom: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: #7a6048;
  font-size: 0.84rem;
  font-weight: 900;
}

.form-intro h4 {
  margin: 0 0 8px;
  font-size: 1.25rem;
  color: #5f4b3a;
}

.form-intro p {
  margin: 0;
  color: #7b6a58;
  line-height: 1.7;
  font-size: 0.95rem;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.horarios-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.horario-card {
  display: grid;
  gap: 14px;
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(236, 231, 216, 0.9);
  box-shadow: 0 12px 26px rgba(92, 75, 59, 0.06);
}

.horario-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.horario-head strong {
  color: #5f4b3a;
  font-size: 1rem;
}

.toggle-line {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #7b6a58;
  font-weight: 700;
}

.horario-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.field {
  display: grid;
  gap: 8px;
}

.field label {
  color: #5f4b3a;
  font-weight: 800;
  font-size: 0.92rem;
}

input[type='time'] {
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.24);
  background: rgba(255, 255, 255, 0.96);
  color: #5f4b3a;
  font-size: 0.96rem;
  outline: none;
  transition: border-color 0.24s ease, box-shadow 0.24s ease, transform 0.24s ease;
  font-family: inherit;
}

input[type='time']:focus {
  border-color: #d4a373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
  transform: translateY(-1px);
}

input[type='time']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.acciones-formulario {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 4px;
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
  background: linear-gradient(135deg, #d4a373, #bf8c5a);
  color: white;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.24);
}

.secondary-btn {
  background: rgba(204, 213, 174, 0.58);
  color: #5f4b3a;
  box-shadow: 0 12px 24px rgba(179, 192, 136, 0.2);
}

.primary-btn:hover:not(:disabled),
.secondary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.primary-btn:disabled,
.secondary-btn:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

@media (max-width: 760px) {
  .horarios-grid,
  .horario-fields {
    grid-template-columns: 1fr;
  }

  .acciones-formulario {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
}
</style>
