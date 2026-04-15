<script setup lang="ts">
import { computed } from 'vue'
import type { AdminHorario } from '@/types'
//son los datoos que el papá le pasa al hijo 
//o sea el adminhorario puede recibir desde afuera lo q es modelValue y el cargando
const props = defineProps<{
  modelValue?: AdminHorario[] | null
  cargando?: boolean
}>()
//este es el contrario de lo de arriba, el hijo le avisa algo al papá 
//aquí  le está diciendo al papá de q: el usuario cancelo, haz algo tu q yo no sé q onda
const emit = defineEmits<{
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
// aquí agarramos un valor calculado (el computed) para que se arme automáicamente a partir de otros datos 
//y pues aquí estamos armando la lista de los horarios así bonito
const horariosOrdenados = computed(() =>
//recorre día por día
  diasSemana.map((dia) => {
    //aquí busca en los horarios si existe uno pa ese día... busca en el props.modelValue el objeto cuyo día es igual
    const horario = props.modelValue?.find((item) => item.dia_semana === dia)
//aquí construímos el objeto nuevo pal día 
    return {
      //nombre del día
      dia_semana: dia,
      //aquí está cortando el formato de la hora por una cosilla q tenemos en el back jaajja
      hora_inicio: horario?.hora_inicio?.slice(0, 5) || '--:--',
      //lo mismo 
      hora_fin: horario?.hora_fin?.slice(0, 5) || '--:--',
      //ps si existe el valor ponle el valor, si no, ponle false :3
      activo: horario?.activo ?? false,
    }
  })
)

function cancelar() {
  emit('cancel')
}
</script>

<template>
  <div class="formulario-panel">
    <div class="form-intro">
      <span class="form-tag">Horario semanal</span>
      <h4>Horario registrado del estilista</h4>
      <p>
        Esta vista solo muestra el horario base guardado en la base de datos.
      </p>
    </div>

    <div v-if="cargando" class="loading-state">
      <div class="loader"></div>
      <p>Cargando horario...</p>
    </div>

    <div v-else class="tabla-shell">
      <table class="tabla-horario">
        <thead>
          <tr>
            <th>Día</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horario in horariosOrdenados" :key="horario.dia_semana">
            <td>{{ horario.dia_semana }}</td>
            <td>{{ horario.hora_inicio }}</td>
            <td>{{ horario.hora_fin }}</td>
            <td>
              <span class="estado-pill" :class="horario.activo ? 'activo' : 'descanso'">
                {{ horario.activo ? 'Activo' : 'Descanso' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="acciones-formulario">
      <button type="button" class="secondary-btn" @click="cancelar">
        Cerrar
      </button>
    </div>
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

.tabla-shell {
  overflow-x: auto;
  padding-bottom: 6px;
}

.tabla-horario {
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.74);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 12px 26px rgba(92, 75, 59, 0.06);
}

.tabla-horario th,
.tabla-horario td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid rgba(92, 75, 59, 0.08);
  color: #5f4b3a;
}

.tabla-horario th {
  background: rgba(250, 237, 205, 0.58);
  color: #6c5743;
  font-size: 0.92rem;
  font-weight: 900;
}

.tabla-horario tbody tr:last-child td {
  border-bottom: none;
}

.estado-pill {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 800;
}

.estado-pill.activo {
  background: rgba(204, 213, 174, 0.45);
  color: #536437;
}

.estado-pill.descanso {
  background: rgba(255, 228, 228, 0.85);
  color: #a14444;
}

.acciones-formulario {
  display: flex;
  justify-content: flex-end;
}

.secondary-btn {
  padding: 12px 18px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 900;
  font-size: 0.95rem;
  background: rgba(204, 213, 174, 0.58);
  color: #5f4b3a;
  box-shadow: 0 12px 24px rgba(179, 192, 136, 0.2);
  transition: transform 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease;
}

.secondary-btn:hover {
  transform: translateY(-2px);
}

.loading-state {
  display: grid;
  place-items: center;
  text-align: center;
  color: #7b6a58;
  min-height: 180px;
}

.loader {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 4px solid rgba(212, 163, 115, 0.22);
  border-top-color: #d4a373;
  animation: spin 0.85s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 760px) {
  .tabla-horario {
    min-width: 100%;
  }

  .acciones-formulario {
    justify-content: stretch;
  }

  .secondary-btn {
    width: 100%;
  }
}
</style>
