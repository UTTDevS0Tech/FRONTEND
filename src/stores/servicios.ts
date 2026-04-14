import { defineStore } from 'pinia'
import { ref } from 'vue'
//habia usado el de diego y ya no se q hizo el dani para arreglarlo
//pero yo no le voy a mover alm
import { useApiFetchDiego } from '@/composables/useApi'
import type { Servicio, ApiResponse } from '@/types'


//crea el store
export const useServiciosStore = defineStore('servicios', () => {

  //lista global de servicios
  const servicios = ref<Servicio[]>([])

  //un solo servicio (para ver detalle o edit pq así lo trae el backend)
  const servicio = ref<Servicio | null>(null)

  const cargando = ref(false)

  //errores
  const error = ref<string | null>(null)
  const mensaje = ref<string | null>(null)


  //trae todos los servicios
  async function obtenerServicios() {
    cargando.value = true //prende loader
    error.value = null //limpia errores viejos

    try {
      //hace GET
      const { data, error: fetchError } = await useApiFetchDiego('/servicios')
        .get()
        .json<ApiResponse<Servicio[]>>()

      //si hubo error en fetch
      if (fetchError.value) {
        throw fetchError.value
      }

      //guarda servicios
      servicios.value = data.value?.data || []

      //mensaje del backend
      mensaje.value = data.value?.message || null

    } catch (err: any) {
      //si algo truena
      error.value = err?.message || 'Error al obtener servicios.'

    } finally {
      //si o si apaga loader
      cargando.value = false
    }
  }


  //trae un servicio por id
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

      //guarda el servicio individual
      servicio.value = data.value?.data || null

      mensaje.value = data.value?.message || null

      //lo regresa por si lo ocupa en el componente
      return data.value?.data || null

    } catch (err: any) {
      error.value = err?.message || 'Error al obtener el servicio.'
      return null

    } finally {
      cargando.value = false
    }
  }


  //crear servicio
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

      //vuelve traer la lista para actualizar
      await obtenerServicios()

      return data.value?.data || null

    } catch (err: any) {
      error.value = err?.message || 'Error al crear servicio.'

      //esto deja que el componente también maneje el error
      throw err

    } finally {
      cargando.value = false
    }
  }


  //actualizar servicio
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

      //refresca lista pa que todo esté al tiro
      await obtenerServicios()

      return data.value?.data || null

    } catch (err: any) {
      error.value = err?.message || 'Error al actualizar servicio.'
      throw err

    } finally {
      cargando.value = false
    }
  }


  //eliminar servicio
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

      //recarga lista
      await obtenerServicios()

      return true

    } catch (err: any) {
      error.value = err?.message || 'Error al eliminar servicio.'
      throw err

    } finally {
      cargando.value = false
    }
  }


  //toggle (activo/inactivo)
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

      //refresca lista
      await obtenerServicios()

      return data.value?.data || null

    } catch (err: any) {
      error.value = err?.message || 'Error al cambiar estado del servicio.'
      throw err

    } finally {
      cargando.value = false
    }
  }


  //limpia mensajes
  function limpiarMensajes() {
    error.value = null
    mensaje.value = null
  }


  //exporta todo pa usarlo en componentes
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