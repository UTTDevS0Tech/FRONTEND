import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiFetchDiego } from '@/composables/useApi'
import type {
  CitaEscritorioPayload,
  CitaEscritorioResponse,
} from '@/types/citaEscritorio'

export const useCitaEscritorioStore = defineStore('citaEscritorio', () => {
  const citas = ref<CitaEscritorioResponse[]>([])
  const loading = ref(false)
  const error = ref('')
  const mensaje = ref('')

  function validarPayload(payload: CitaEscritorioPayload) {
    if (!payload.cliente_id) {
      throw new Error('Debes seleccionar un cliente')
    }

    if (!payload.personal_id) {
      throw new Error('Debes seleccionar personal')
    }

    if (!payload.fecha_c) {
      throw new Error('Debes seleccionar una fecha')
    }

    if (!payload.hora_c) {
      throw new Error('Debes seleccionar una hora')
    }

    if (!payload.detalles || !Array.isArray(payload.detalles) || payload.detalles.length === 0) {
      throw new Error('Debes agregar al menos un servicio')
    }

    const detallesInvalidos = payload.detalles.some(
      (detalle) => !detalle.servicio_id || Number(detalle.subtotal) <= 0
    )

    if (detallesInvalidos) {
      throw new Error('Hay servicios inválidos en la cita')
    }

    if (Number(payload.total) <= 0) {
      throw new Error('El total debe ser mayor a 0')
    }
  }

  async function obtenerCitas() {
    loading.value = true
    error.value = ''

    try {
      const { data, error: fetchError } = await useApiFetchDiego('/citas-escritorio')
        .get()
        .json()

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudieron obtener las citas')
      }

      citas.value = data.value?.data || []
    } catch (err: any) {
      error.value = err.message || 'Error al obtener citas'
    } finally {
      loading.value = false
    }
  }

  async function crearCita(payload: CitaEscritorioPayload) {
    loading.value = true
    error.value = ''
    mensaje.value = ''

    try {
      validarPayload(payload)

      const { data, error: fetchError } = await useApiFetchDiego('/citas-escritorio')
        .post(payload)
        .json()

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudo crear la cita')
      }

      mensaje.value = data.value?.message || 'Cita creada correctamente'
      await obtenerCitas()
      return data.value
    } catch (err: any) {
      error.value = err.message || 'Error al crear la cita'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function actualizarCita(id: number, payload: CitaEscritorioPayload) {
    loading.value = true
    error.value = ''
    mensaje.value = ''

    try {
      validarPayload(payload)

      const { data, error: fetchError } = await useApiFetchDiego(`/citas-escritorio/${id}`)
        .put(payload)
        .json()

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudo actualizar la cita')
      }

      mensaje.value = data.value?.message || 'Cita actualizada correctamente'
      await obtenerCitas()
      return data.value
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar la cita'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function eliminarCita(id: number) {
    loading.value = true
    error.value = ''
    mensaje.value = ''

    try {
      const { data, error: fetchError } = await useApiFetchDiego(`/citas-escritorio/${id}`)
        .delete()
        .json()

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudo eliminar la cita')
      }

      mensaje.value = data.value?.message || 'Cita eliminada correctamente'
      await obtenerCitas()
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar la cita'
      throw err
    } finally {
      loading.value = false
    }
  }

  function limpiarMensajes() {
    error.value = ''
    mensaje.value = ''
  }

  return {
    citas,
    loading,
    error,
    mensaje,
    obtenerCitas,
    crearCita,
    actualizarCita,
    eliminarCita,
    limpiarMensajes,
  }
})