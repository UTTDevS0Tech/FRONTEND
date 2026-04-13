import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiFetchDiego } from '@/composables/useApi'
import type { ApiResponse, AdminHorario, AdminHorarioSemanaPayload } from '@/types'

export const useAdminHorarioStore = defineStore('admin-horario', () => {
  const horarios = ref<AdminHorario[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)
  const mensaje = ref<string | null>(null)

  async function obtenerHorarios(personalId: number) {
    cargando.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useApiFetchDiego(`personales/${personalId}/horarios`)
        .get()
        .json<ApiResponse<AdminHorario[]>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      horarios.value = data.value?.data || []
      mensaje.value = data.value?.message || null
      return horarios.value
    } catch (err: any) {
      error.value = err?.data?.message ?? err?.message ?? 'Error al obtener horarios'
      return []
    } finally {
      cargando.value = false
    }
  }

  async function guardarHorarios(personalId: number, payload: AdminHorarioSemanaPayload) {
    cargando.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useApiFetchDiego(`personales/${personalId}/horarios`)
        .put(payload)
        .json<ApiResponse<AdminHorario[]>>()

      if (fetchError.value) {
        throw fetchError.value
      }

      horarios.value = data.value?.data || []
      mensaje.value = data.value?.message ?? 'Horarios guardados correctamente'
      return horarios.value
    } catch (err: any) {
      error.value = err?.data?.message ?? err?.message ?? 'Error al guardar horarios'
      return []
    } finally {
      cargando.value = false
    }
  }

  function limpiarMensajes() {
    error.value = null
    mensaje.value = null
  }

  return {
    horarios,
    cargando,
    error,
    mensaje,
    obtenerHorarios,
    guardarHorarios,
    limpiarMensajes,
  }
})
