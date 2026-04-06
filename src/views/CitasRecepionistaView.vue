<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCitaEscritorioStore } from '@/stores/citaEscritorio'

const citaStore = useCitaEscritorioStore()
const search = ref('')

onMounted(() => {
  citaStore.obtenerCitas()
})

function obtenerNombreCliente(cita: any) {
  return (
    cita.cliente?.nombre ||
    `${cita.cliente?.nom || ''} ${cita.cliente?.apellido_p || ''} ${cita.cliente?.apellido_m || ''}`.trim() ||
    `Cliente #${cita.cliente_id}`
  )
}

function obtenerNombrePersonal(cita: any) {
  return (
    cita.personal?.nombre ||
    cita.personal?.nom ||
    `Personal #${cita.personal_id}`
  )
}

const citasFiltradas = computed(() => {
  const texto = search.value.trim().toLowerCase()

  if (!texto) return citaStore.citas

  return citaStore.citas.filter((cita: any) => {
    const nombreCliente = obtenerNombreCliente(cita)
    return nombreCliente.toLowerCase().includes(texto)
  })
})
</script>

<template>
  <main class="citas-page">
    <section class="card">
      <div class="card-header">
        <div>
          <h1>Citas pendientes</h1>
          <p>Consulta todos los tickets del sistema y filtra por cliente.</p>
        </div>

        <input
          v-model="search"
          type="text"
          placeholder="Buscar por cliente..."
          class="search-input"
        />
      </div>

      <div v-if="citaStore.loading">Cargando citas...</div>

      <table v-else class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Personal</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cita in citasFiltradas" :key="cita.id">
            <td>{{ cita.id }}</td>
            <td>{{ obtenerNombreCliente(cita) }}</td>
            <td>{{ obtenerNombrePersonal(cita) }}</td>
            <td>{{ cita.fecha_c }}</td>
            <td>{{ cita.hora_c }}</td>
            <td>${{ cita.total }}</td>
            <td>{{ cita.estado }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>