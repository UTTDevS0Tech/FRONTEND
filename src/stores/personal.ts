import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiFetchDiego } from '@/composables/useApi'

export interface PersonalOption {
  id: number
  nombre: string
}

export const usePersonalStore = defineStore('personal', () => {
  const personales = ref<PersonalOption[]>([])
  const loading = ref(false)
  const error = ref('')

  async function obtenerPersonales() {
    loading.value = true
    error.value = ''

    try {
      const { data, error: fetchError } = await useApiFetchDiego('/estilistas')
        .get()
        .json()

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudo obtener el personal')
      }

      personales.value = data.value?.data || []
    } catch (err: any) {
      error.value = err.message || 'Error al obtener personal'
    } finally {
      loading.value = false
    }
  }

  return {
    personales,
    loading,
    error,
    obtenerPersonales,
  }
})