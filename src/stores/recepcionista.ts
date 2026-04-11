import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiFetchDiego } from '@/composables/useApi'
import type { Cliente } from '@/types'

export interface CrearClientePayload {
  nom: string
  apellido_p: string
  apellido_m: string
  tel?: string
}

export interface ActualizarClientePayload {
  nom: string
  apellido_p: string
  apellido_m: string
  tel?: string
}

export const useRecepcionistaStore = defineStore('recepcionista', () => {
  const clientes = ref<Cliente[]>([])
  const citasCliente = ref<any[]>([])
  const clienteSeleccionado = ref<Cliente | null>(null)

  const loading = ref(false)
  const error = ref('')
  const mensaje = ref('')

  async function buscarClientes(search = '') {    
    loading.value = true
    error.value = ''

    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : ''

      const { data, error: fetchError } = await useApiFetchDiego(`/ver-clientes${query}`)
        .get()
        .json()

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudieron obtener clientes')
      }

      const coleccion = data.value?.data?.data || data.value?.data || []
      clientes.value = Array.isArray(coleccion) ? coleccion : []

      return clientes.value
    } catch (err: any) {
      error.value = err.message || 'Error al buscar clientes'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function crearCliente(payload: CrearClientePayload) {
    loading.value = true
    error.value = ''
    mensaje.value = ''

    try {
      const { data, error: fetchError } = await useApiFetchDiego('/crear-cliente')
        .post(payload)
        .json()

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudo crear el cliente')
      }

      const cliente = data.value?.data as Cliente | undefined
      mensaje.value = data.value?.message || 'Cliente creado correctamente'

      if (cliente) {
        clienteSeleccionado.value = cliente
      }

      await buscarClientes()
      return cliente
    } catch (err: any) {
      error.value = err.message || 'Error al crear cliente'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function buscarCitasPorCliente(search = '') {
    loading.value = true
    error.value = ''

    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : ''

      const { data, error: fetchError } = await useApiFetchDiego(`/buscar-citas-cliente${query}`)
        .get()
        .json()

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudieron buscar las citas')
      }

      citasCliente.value = data.value?.data?.data || data.value?.data || []
      return citasCliente.value
    } catch (err: any) {
      error.value = err.message || 'Error al buscar citas por cliente'
      throw err
    } finally {
      loading.value = false
    }
  }

  function seleccionarCliente(cliente: Cliente) {
    clienteSeleccionado.value = cliente
  }

  async function actualizarCliente(id: number, payload: ActualizarClientePayload) {
    loading.value = true
    error.value = ''
    mensaje.value = ''

    try {
      const { data, error: fetchError } = await useApiFetchDiego(`/clientes/${id}`)
        .put(payload)
        .json()

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudo actualizar el cliente')
      }

      mensaje.value = data.value?.message || 'Cliente actualizado correctamente'
      await buscarClientes()
      return data.value?.data as Cliente | undefined
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar cliente'
      throw err
    } finally {
      loading.value = false
    }
  }

  function limpiarClienteSeleccionado() {
    clienteSeleccionado.value = null
  }

  return {
    clientes,
    citasCliente,
    clienteSeleccionado,
    loading,
    error,
    mensaje,
    buscarClientes,
    crearCliente,
    actualizarCliente,
    buscarCitasPorCliente,
    seleccionarCliente,
    limpiarClienteSeleccionado,
  }
})
