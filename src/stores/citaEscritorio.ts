import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiCitaEscritorio } from '@/composables/UseApiCitaEscritorio'
import type {
  CitaEscritorioPayload,
  CitaEscritorioResponse,
} from '@/types/citaEscritorio'

function obtenerMensajeError(fetchError: any, data: any, fallback: string) {
  const errores =
    data?.errors ||
    fetchError?.data?.errors ||
    fetchError?.response?._data?.errors

  if (errores) {
    const primerError = Object.values(errores)[0]
    return Array.isArray(primerError) ? String(primerError[0]) : fallback
  }

  return (
    data?.message ||
    fetchError?.data?.message ||
    fetchError?.response?._data?.message ||
    fetchError?.message ||
    fallback
  )
}

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

    if (payload.detalles.length > 3) {
      throw new Error('Solo puedes agregar máximo 3 servicios')
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
      const { data, error: fetchError } = await useApiCitaEscritorio('/citas-escritorio')
        .get()
        .json()

      if (fetchError.value) {
        throw new Error(
          obtenerMensajeError(fetchError.value, data.value, 'No se pudieron obtener las citas')
        )
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

      const { data, error: fetchError } = await useApiCitaEscritorio('/citas-escritorio')
        .post(payload)
        .json()

      if (fetchError.value) {
        throw new Error(
          obtenerMensajeError(fetchError.value, data.value, 'No se pudo crear la cita')
        )
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

      const { data, error: fetchError } = await useApiCitaEscritorio(`/citas-escritorio/${id}`)
        .put(payload)
        .json()

      if (fetchError.value) {
        throw new Error(
          obtenerMensajeError(fetchError.value, data.value, 'No se pudo actualizar la cita')
        )
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
      const { data, error: fetchError } = await useApiCitaEscritorio(`/citas-escritorio/${id}`)
        .delete()
        .json()

      if (fetchError.value) {
        throw new Error(
          obtenerMensajeError(fetchError.value, data.value, 'No se pudo eliminar la cita')
        )
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