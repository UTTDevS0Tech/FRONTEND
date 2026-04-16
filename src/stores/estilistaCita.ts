import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { EstilistaCita } from '@/types'
import { useApiFetchDiego } from '@/composables/useApi'

interface FiltrosCitasEstilista {
  dia?: string
  mes?: string
  anio?: string
}

function construirQuery(params: Record<string, string>) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([clave, valor]) => {
    if (valor) {
      searchParams.append(clave, valor)
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const usePersonalCitasStore = defineStore('personalcitas', () => {
  const citasFuturas = ref<EstilistaCita[]>([])
  const citasPasadas = ref<EstilistaCita[]>([])
  const mensajeError = ref('')
  const cargando = ref(false)

  async function obtenerCitasDePersonal(filtros: FiltrosCitasEstilista = {}) {
    mensajeError.value = ''
    cargando.value = true

    const filtrosBase = {
      dia: filtros.dia ?? '',
      mes: filtros.mes ?? '',
      anio: filtros.anio ?? '',
    }

    const queryFuturas = construirQuery({
      ...filtrosBase,
      categoria: 'futura',
    })

    const queryPasadas = construirQuery({
      ...filtrosBase,
      categoria: 'pasada',
    })

    try {
      const [respuestaFuturas, respuestaPasadas] = await Promise.all([
        useApiFetchDiego(`verMisCitasComoEstilista${queryFuturas}`).get().json(),
        useApiFetchDiego(`verMisCitasComoEstilista${queryPasadas}`).get().json(),
      ])

      const { data: dataFuturas, error: errorFuturas } = respuestaFuturas
      const { data: dataPasadas, error: errorPasadas } = respuestaPasadas

      if (errorFuturas.value || errorPasadas.value) {
        mensajeError.value =
          errorFuturas.value?.message ||
          errorPasadas.value?.message ||
          'hubo error al traer citas'
        citasFuturas.value = []
        citasPasadas.value = []
        return
      }

      citasFuturas.value = Array.isArray(dataFuturas.value?.data) ? dataFuturas.value.data : []
      citasPasadas.value = Array.isArray(dataPasadas.value?.data) ? dataPasadas.value.data : []
    } catch (e: any) {
      console.log(e, 'error')
      mensajeError.value = e?.message ?? 'hubo error al traer citas'
      citasFuturas.value = []
      citasPasadas.value = []
    } finally {
      cargando.value = false
    }
  }

  return {
    mensajeError,
    cargando,
    citasFuturas,
    citasPasadas,
    obtenerCitasDePersonal,
  }
})
