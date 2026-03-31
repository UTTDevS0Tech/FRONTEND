<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TipoServicioForm from '@/components/TipoServicioForm.vue'
import { useServiciosStore } from '@/stores/servicios'
import { useTipoServiciosStore } from '@/stores/tipoServicios'
import type { TipoServicio } from '@/types'

const serviciosStore = useServiciosStore()
const tipoServiciosStore = useTipoServiciosStore()

const seleccionado = ref<TipoServicio | null>(null)

const totalActivos = computed(() => {
  return tipoServiciosStore.tipoServicios.filter(tipo => tipo.activo).length
})

async function cargarTodo() {
  try {
    await Promise.all([
      serviciosStore.obtenerServicios(),
      tipoServiciosStore.obtenerTiposServicio()
    ])
  } catch (err) {
    console.error('Error al cargar datos iniciales:', err)
  }
}

async function guardar(payload: FormData) {
  try {
    if (seleccionado.value?.id) {
      await tipoServiciosStore.actualizarTipoServicio(seleccionado.value.id, payload)
    } else {
      await tipoServiciosStore.crearTipoServicio(payload)
    }

    limpiarSeleccion()
  } catch (err) {
    console.error('Error al guardar tipo de servicio:', err)
  }
}

function editar(item: TipoServicio) {
  seleccionado.value = { ...item }
}

function limpiarSeleccion() {
  seleccionado.value = null
}

async function eliminar(id?: number) {
  if (!id) return

  const confirmar = confirm('¿Seguro que deseas eliminar este tipo de servicio?')
  if (!confirmar) return

  try {
    await tipoServiciosStore.eliminarTipoServicio(id)

    if (seleccionado.value?.id === id) {
      limpiarSeleccion()
    }
  } catch (err) {
    console.error('Error al eliminar tipo de servicio:', err)
  }
}

async function toggleEstado(id?: number) {
  if (!id) return

  try {
    await tipoServiciosStore.toggleTipoServicio(id)
  } catch (err) {
    console.error('Error al cambiar estado:', err)
  }
}

function obtenerNombreServicio(servicioId: number) {
  const servicio = serviciosStore.servicios.find(item => item.id === servicioId)
  return servicio?.nombre || `#${servicioId}`
}

onMounted(() => {
  cargarTodo()
})
</script>

<template>
  <section>
    <h1>Tipos de servicio</h1>
    <p>Total registrados: {{ tipoServiciosStore.tipoServicios.length }}</p>
    <p>Total activos: {{ totalActivos }}</p>

    <div v-if="tipoServiciosStore.mensaje">
      {{ tipoServiciosStore.mensaje }}
    </div>

    <div v-if="tipoServiciosStore.error">
      {{ tipoServiciosStore.error }}
    </div>

    <TipoServicioForm
      :model-value="seleccionado"
      :servicios="serviciosStore.servicios"
      :cargando="tipoServiciosStore.cargando"
      @submit="guardar"
      @cancel="limpiarSeleccion"
    />

    <div v-if="tipoServiciosStore.cargando">
      <p>Cargando tipos de servicio...</p>
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Servicio</th>
          <th>Precio</th>
          <th>Tiempo</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="tipo in tipoServiciosStore.tipoServicios"
          :key="tipo.id"
        >
          <td>#{{ tipo.id }}</td>
          <td>{{ tipo.nombre }}</td>
          <td>{{ obtenerNombreServicio(tipo.servicio_id) }}</td>
          <td>${{ Number(tipo.precio).toFixed(2) }}</td>
          <td>{{ tipo.tiempo_estimado }} min</td>
          <td>{{ tipo.activo ? 'Activo' : 'Inactivo' }}</td>
          <td>
            <button type="button" @click="editar(tipo)">
              Editar
            </button>

            <button type="button" @click="toggleEstado(tipo.id)">
              {{ tipo.activo ? 'Desactivar' : 'Activar' }}
            </button>

            <button type="button" @click="eliminar(tipo.id)">
              Eliminar
            </button>
          </td>
        </tr>

        <tr v-if="!tipoServiciosStore.tipoServicios.length">
          <td colspan="7">
            No hay tipos de servicio registrados.
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>