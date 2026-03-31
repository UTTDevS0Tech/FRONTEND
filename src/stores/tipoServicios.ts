import {defineStore} from 'pinia'
import {ref} from 'vue'
import {useApiFetchTipoServicios} from '@/composables/useApi2'
import type {TipoServicio, ApiResponse} from '@/types'

export const useTipoServiciosStore = defineStore('tipo-servicios', () => {
  const tipoServicios = ref<TipoServicio[]>([])
  const tipoServicio = ref<TipoServicio | null>(null)
  const cargando = ref(false)
  const error = ref<string | null>(null)
  const mensaje = ref<string | null>(null)

  async function obtenerTiposServicio() {
    cargando.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useApiFetchTipoServicios('/tipo-servicios')
        .get()
        .json<ApiResponse<TipoServicio[]>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      tipoServicios.value = data.value?.data ?? []
      mensaje.value = data.value?.message ?? null
    } catch (err: any) {
      error.value = err?.message ?? 'Error al obtener los tipos de servicio'
    } finally {
      cargando.value = false
    }
  }

  async function obtenerTipoServicioPorId(id: number) {
    cargando.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useApiFetchTipoServicios(`/tipo-servicios/${id}`)
        .get()
        .json<ApiResponse<TipoServicio>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      tipoServicio.value = data.value?.data ?? null
      return tipoServicio.value
    } catch (err: any) {
      error.value = err?.message ?? 'Error al obtener el tipo de servicio.'
      return null
    } finally {
      cargando.value = false
    }
  }

  async function crearTipoServicio(payload: FormData) {
    cargando.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useApiFetchTipoServicios('/tipo-servicios')
        .post(payload)
        .json<ApiResponse<TipoServicio>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      mensaje.value = data.value?.message ?? 'Tipo de servicio creado correctamente.'
      await obtenerTiposServicio()
      return data.value?.data ?? null
    } catch (err: any) {
      error.value = err?.message ?? 'Error al crear el tipo de servicio.'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function actualizarTipoServicio(id: number, payload: FormData) {
    cargando.value = true
    error.value = null

    try {
      payload.append('_method', 'PUT')

      const { data, error: fetchError } = await useApiFetchTipoServicios(`/tipo-servicios/${id}`)
        .post(payload)
        .json<ApiResponse<TipoServicio>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      mensaje.value = data.value?.message ?? 'Tipo de servicio actualizado correctamente.'
      await obtenerTiposServicio()
      return data.value?.data ?? null
    } catch (err: any) {
      error.value = err?.message ?? 'Error al actualizar el tipo de servicio.'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function eliminarTipoServicio(id: number) {
    cargando.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useApiFetchTipoServicios(`/tipo-servicios/${id}`)
        .delete()
        .json<ApiResponse<null>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      mensaje.value = data.value?.message ?? 'Tipo de servicio eliminado correctamente.'
      await obtenerTiposServicio()
      return true
    } catch (err: any) {
      error.value = err?.message ?? 'Error al eliminar el tipo de servicio.'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function toggleTipoServicio(id: number) {
    cargando.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useApiFetchTipoServicios(`/tipo-servicios/${id}/toggle-status`)
        .patch({})
        .json<ApiResponse<TipoServicio>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      mensaje.value = data.value?.message ?? 'Estado actualizado correctamente.'
      await obtenerTiposServicio()
      return data.value?.data ?? null
    } catch (err: any) {
      error.value = err?.message ?? 'Error al cambiar el estado.'
      throw err
    } finally {
      cargando.value = false
    }
  }

  function limpiarMensajes() {
    error.value = null
    mensaje.value = null
  }

  return {
    tipoServicios,
    tipoServicio,
    cargando,
    error,
    mensaje,
    obtenerTiposServicio,
    obtenerTipoServicioPorId,
    crearTipoServicio,
    actualizarTipoServicio,
    eliminarTipoServicio,
    toggleTipoServicio,
    limpiarMensajes,
  }
})