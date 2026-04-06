import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiFetchDiego } from '@/composables/useApi'

export interface ClienteOption {
  id: number
  nombre: string
}

export const useClienteStore = defineStore('cliente', () => {
  const clientes = ref<ClienteOption[]>([])
  const loading = ref(false)
  const error = ref('')

  async function obtenerClientes() {
    loading.value = true
    error.value = ''

    try {
      const { data, error: fetchError } = await useApiFetchDiego('/ver-clientes')
        .get()
        .json()

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudieron obtener los clientes')
      }

      clientes.value = data.value?.data || []
    } catch (err: any) {
      error.value = err.message || 'Error al obtener clientes'
    } finally {
      loading.value = false
    }
  }

  return {
    clientes,
    loading,
    error,
    obtenerClientes,
  }
})