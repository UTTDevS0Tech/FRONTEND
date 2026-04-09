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

    // Validación de hora (09:00 - 20:00)
   const [horas = 0, minutos = 0] = payload.hora_c.split(':').map(Number)
    const totalMinutos = horas * 60 + minutos
    if (totalMinutos < 9 * 60) {
      throw new Error('La hora de la cita no puede ser antes de las 09:00')
    }
    if (totalMinutos > 20 * 60) {
      throw new Error('La hora de la cita no puede ser después de las 20:00')
    }

    // Validación de año (máximo 2050)
    const año = new Date(payload.fecha_c).getFullYear()
    if (año > 2050) {
      throw new Error('La fecha de la cita no puede ser mayor al 31-12-2050')
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

  function extraerMensajeError(fetchError: any, fallback: string): string {
    const errData = fetchError?.data
    if (errData?.errors) {
      const mensajes = Object.values(errData.errors).flat().join(' | ')
      return mensajes as string
    }
    if (errData?.message) {
      return errData.message
    }
    return fallback
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
        throw new Error(extraerMensajeError(fetchError.value, 'No se pudo crear la cita'))
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
        throw new Error(extraerMensajeError(fetchError.value, 'No se pudo actualizar la cita'))
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
        throw new Error(extraerMensajeError(fetchError.value, 'No se pudo eliminar la cita'))
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