import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiFetchDiego } from '@/composables/useApi'
import type { Servicio, ApiResponse } from '@/types'

export const useServiciosStore = defineStore('servicios', () => {
  const servicios = ref<Servicio[]>([])
  const servicio = ref<Servicio | null>(null)
  const cargando = ref(false)
  const error = ref<string | null>(null)
  const mensaje = ref<string | null>(null)

  async function obtenerServicios() {
    cargando.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useApiFetchDiego('/servicios')
        .get()
        .json<ApiResponse<Servicio[]>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      servicios.value = data.value?.data || []
      mensaje.value = data.value?.message || null
    } catch (err: any) {
      error.value = err?.message || 'Error al obtener servicios.'
    } finally {
      cargando.value = false
    }
  }

  async function obtenerServicioPorId(id: number) {
    cargando.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useApiFetchDiego(`/servicios/${id}`)
        .get()
        .json<ApiResponse<Servicio>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      servicio.value = data.value?.data || null
      mensaje.value = data.value?.message || null

      return data.value?.data || null
    } catch (err: any) {
      error.value = err?.message || 'Error al obtener el servicio.'
      return null
    } finally {
      cargando.value = false
    }
  }

  async function crearServicio(payload: Pick<Servicio, 'nombre' | 'activo'>) {
    cargando.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useApiFetchDiego('/servicios')
        .post(payload)
        .json<ApiResponse<Servicio>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      mensaje.value = data.value?.message || 'Servicio creado correctamente.'

      await obtenerServicios()

      return data.value?.data || null
    } catch (err: any) {
      error.value = err?.message || 'Error al crear servicio.'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function actualizarServicio(id: number, payload: Pick<Servicio, 'nombre' | 'activo'>) {
    cargando.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useApiFetchDiego(`/servicios/${id}`)
        .put(payload)
        .json<ApiResponse<Servicio>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      mensaje.value = data.value?.message || 'Servicio actualizado correctamente.'

      await obtenerServicios()

      return data.value?.data || null
    } catch (err: any) {
      error.value = err?.message || 'Error al actualizar servicio.'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function eliminarServicio(id: number) {
    cargando.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useApiFetchDiego(`/servicios/${id}`)
        .delete()
        .json<ApiResponse<null>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      mensaje.value = data.value?.message || 'Servicio eliminado correctamente.'

      await obtenerServicios()

      return true
    } catch (err: any) {
      error.value = err?.message || 'Error al eliminar servicio.'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function toggleServicio(id: number) {
    cargando.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useApiFetchDiego(`/servicio/${id}/toggle`)
        .patch({})
        .json<ApiResponse<Servicio>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      mensaje.value = data.value?.message || 'Estado del servicio actualizado correctamente.'

      await obtenerServicios()

      return data.value?.data || null
    } catch (err: any) {
      error.value = err?.message || 'Error al cambiar estado del servicio.'
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
    servicios,
    servicio,
    cargando,
    error,
    mensaje,
    obtenerServicios,
    obtenerServicioPorId,
    crearServicio,
    actualizarServicio,
    eliminarServicio,
    toggleServicio,
    limpiarMensajes,
  }
})