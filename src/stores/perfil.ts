import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiFetchDiego } from '@/composables/useApi'
import type {
  FormularioPerfilCliente,
  PerfilCliente,
  PerfilClienteCita,
  PerfilClientePayload,
} from '@/types'

function normalizarHora(valor?: string | null) {
  return valor ? valor.slice(0, 5) : '00:00'
}

function normalizarFecha(valor?: string | null) {
  return valor ? valor.slice(0, 10) : ''
}

function construirMomento(fecha: string, hora?: string | null) {
  const fechaNormalizada = normalizarFecha(fecha)

  if (!fechaNormalizada) {
    return null
  }

  return new Date(`${fechaNormalizada}T${normalizarHora(hora)}:00`)
}

export const usePerfilStore = defineStore('perfil', () => {
  const perfil = ref<PerfilCliente | null>(null)
  const citas = ref<PerfilClienteCita[]>([])

  const loadingPerfil = ref(false)
  const loadingCitas = ref(false)

  const errorPerfil = ref('')
  const errorCitas = ref('')
  const mensaje = ref('')

  const loading = computed(() => loadingPerfil.value || loadingCitas.value)

  const nombreCompleto = computed(() => {
    const cliente = perfil.value?.cliente

    if (!cliente) {
      return 'cliente'
    }

    return (
      cliente.nombre_completo ||
      [cliente.nom, cliente.apellido_p, cliente.apellido_m].filter(Boolean).join(' ').trim() ||
      'cliente'
    )
  })

  const citasPendientes = computed(() => {
    const ahora = new Date()

    return [...citas.value]
      .filter((cita) => {
        if (cita.estado === 'cancelada') {
          return false
        }

        const momentoCita = construirMomento(cita.fecha_c, cita.hora_fin || cita.hora_c)

        if (!momentoCita || Number.isNaN(momentoCita.getTime())) {
          return true
        }

        return momentoCita.getTime() >= ahora.getTime()
      })
      .sort((a, b) => {
        const momentoA = construirMomento(a.fecha_c, a.hora_c)?.getTime() ?? Number.MAX_SAFE_INTEGER
        const momentoB = construirMomento(b.fecha_c, b.hora_c)?.getTime() ?? Number.MAX_SAFE_INTEGER

        return momentoA - momentoB
      })
  })

  const citasPasadas = computed(() => {
    const ahora = new Date()

    return [...citas.value]
      .filter((cita) => {
        if (cita.estado === 'cancelada') {
          return true
        }

        const momentoCita = construirMomento(cita.fecha_c, cita.hora_fin || cita.hora_c)

        if (!momentoCita || Number.isNaN(momentoCita.getTime())) {
          return false
        }

        return momentoCita.getTime() < ahora.getTime()
      })
      .sort((a, b) => {
        const momentoA = construirMomento(a.fecha_c, a.hora_fin || a.hora_c)?.getTime() ?? 0
        const momentoB = construirMomento(b.fecha_c, b.hora_fin || b.hora_c)?.getTime() ?? 0

        return momentoB - momentoA
      })
  })

  function extraerMensajeError(fetchError: any, fallback: string): string {
    const errData = fetchError?.data

    if (errData?.errors) {
      return Object.values(errData.errors).flat().join(' | ') as string
    }

    if (errData?.message) {
      return errData.message as string
    }

    return fallback
  }

  async function obtenerPerfil() {
    loadingPerfil.value = true
    errorPerfil.value = ''
    mensaje.value = ''

    try {
      const { data, error: fetchError } = await useApiFetchDiego('/ver-perfil').get().json()

      if (fetchError.value) {
        throw new Error(extraerMensajeError(fetchError.value, 'Error al obtener el perfil'))
      }

      perfil.value = data.value?.data ?? null
      return perfil.value
    } catch (err: any) {
      errorPerfil.value = err.message || 'Error al obtener el perfil'
      throw err
    } finally {
      loadingPerfil.value = false
    }
  }

  async function actualizarPerfil(payload: PerfilClientePayload) {
    loadingPerfil.value = true
    errorPerfil.value = ''
    mensaje.value = ''

    try {
      const { data, error: fetchError } = await useApiFetchDiego('/editar-perfil').patch(payload).json()

      if (fetchError.value) {
        throw new Error(extraerMensajeError(fetchError.value, 'Error al actualizar el perfil'))
      }

      perfil.value = data.value?.data ?? null
      mensaje.value = data.value?.message || 'Perfil actualizado correctamente'
      return perfil.value
    } catch (err: any) {
      errorPerfil.value = err.message || 'Error al actualizar el perfil'
      throw err
    } finally {
      loadingPerfil.value = false
    }
  }

  async function obtenerMisCitas() {
    loadingCitas.value = true
    errorCitas.value = ''

    try {
      const { data, error: fetchError } = await useApiFetchDiego('/mis-citas').get().json()

      if (fetchError.value) {
        throw new Error(extraerMensajeError(fetchError.value, 'Error al obtener las citas'))
      }

      citas.value = Array.isArray(data.value?.data) ? data.value.data : []
      return citas.value
    } catch (err: any) {
      errorCitas.value = err.message || 'Error al obtener las citas'
      throw err
    } finally {
      loadingCitas.value = false
    }
  }

  function construirFormulario(): FormularioPerfilCliente {
    return {
      nom: perfil.value?.cliente?.nom || '',
      apellido_p: perfil.value?.cliente?.apellido_p || '',
      apellido_m: perfil.value?.cliente?.apellido_m || '',
      email: perfil.value?.email || '',
    }
  }

  function limpiarMensajes() {
    errorPerfil.value = ''
    errorCitas.value = ''
    mensaje.value = ''
  }

  return {
    perfil,
    citas,
    loading,
    loadingPerfil,
    loadingCitas,
    errorPerfil,
    errorCitas,
    mensaje,
    nombreCompleto,
    citasPendientes,
    citasPasadas,
    obtenerPerfil,
    actualizarPerfil,
    obtenerMisCitas,
    construirFormulario,
    limpiarMensajes,
  }
})
