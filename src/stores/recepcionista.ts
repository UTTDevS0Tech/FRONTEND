import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiFetchDiego } from '@/composables/useApi'
import type { Cliente } from '@/types'
// éstas la vdd se me ha pasado moverlas a las interfaces jajaj 
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
//bueno, este es el store de recepcionista, veanlo como un almacén donde vamos
//a guarar lo que ocupamos para éste módulo 
//usamos ref por lo que ya todos sabemos... pa q sea reactivo 
export const useRecepcionistaStore = defineStore('recepcionista', () => {
  //mi lista de clientes
  const clientes = ref<Cliente[]>([])
  //sus ls citas del cliente xd
  const citasCliente = ref<any[]>([])
  //este es el cliente que el recepcionista está usando por el momento
  const clienteSeleccionado = ref<Cliente | null>(null)
  //estas ya todos se las saben pa q son...
  const loading = ref(false)
  const error = ref('')
  const mensaje = ref('')
//aquí tenemos la función de buscar clientes pq q hueva estar scrolleando hasta 
//que encuentre al q quiere seleccionar v
//recibe un search pero tmb opcionalmente puede recibir un texto para filtrar la búsqueda
  async function buscarClientes(search = '') {    
    loading.value = true
    error.value = ''

    try {
      //ok... aquí se pone interesante pq usamos un ternario xdd
      // que es prácticamente: search trae algo? si si entonces armame un query 
      //si no pues déjalo así vacío 
      //antes de que se ondeen el encodeURIComponent es para transformar lo q venga del 
      //search para que sea seguro meterlo en la url pq luego el backend no lo ve como debería vaya
      // ejemplo pa diego: 
      // si el search es "Juan Pérez" entonces el encodeURIComponent lo va a transformar en "Juan%20P%C3%A9rez" y así el backend lo va a entender
      const query = search ? `?search=${encodeURIComponent(search)}` : ''
      // bueno aquí mandamos a llamar el fetch de dieguillo y ps ya se la saben, concatena lo q falta de la ruta, el método y el formato
      const { data, error: fetchError } = await useApiFetchDiego(`/ver-clientes${query}`)
        .get()
        .json()
//esta bien x pero pues si trae error no entra en lo demás y tira este error vdd
      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudieron obtener clientes')
      }
//aquí se agarra la coleccion de los clientes desde el back, contempla las diferentes estructuras de la respsuesta
//si no llega na, pues agarra el arreglo vacío para q no truene
      const coleccion = data.value?.data?.data || data.value?.data || []
      //aquí nadamás se asegura que la colección si sea un arreglo antes de asignarla al estado
      clientes.value = Array.isArray(coleccion) ? coleccion : []
//por fin devuelve los clientes jajaj
      return clientes.value
    } catch (err: any) {
      error.value = err.message || 'Error al buscar clientes'
      throw err
    } finally {
      loading.value = false
    }
  }
//para que cree un cliente c:
//recibe el payload de arriba jajaj
  async function crearCliente(payload: CrearClientePayload) {
    loading.value = true
    error.value = ''
    mensaje.value = ''

    try {
      //otra vez con el fetch de diego le concatenamos la ruta en el back para crear el cliente
      //el método y el formato 
      const { data, error: fetchError } = await useApiFetchDiego('/crear-cliente')
        .post(payload)
        .json()
//lo mismo...
      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudo crear el cliente')
      }
//aquí saca al cliente que vino en la respuesta del back, le dice a ts que debe ser un cliente 
//o q puede ser nadota pa q no truene 
      const cliente = data.value?.data as Cliente | undefined

      mensaje.value = data.value?.message || 'Cliente creado correctamente'
//si el response responde pues lo asigna como cliente seleccionado para crear la cita uwu
      if (cliente) {
        clienteSeleccionado.value = cliente
      }
//dsp de crear al chango lo buscamos pa q actualice el front y se muestre en la lista uwu
      await buscarClientes()
      //y por último devuelve el cliente creado
      return cliente
    } catch (err: any) {
      error.value = err.message || 'Error al crear cliente'
      throw err
    } finally {
      loading.value = false
    }
  }
//otra vez otro query... 
  async function buscarCitasPorCliente(search = '') {
    loading.value = true
    error.value = ''

    try {
      //lo mismo q arriba, si el search trae algo entonces arma el query con el search, si no pues déjalo vacío 
      // y pues ya explicamos que es el encodeURIComponent
      const query = search ? `?search=${encodeURIComponent(search)}` : ''
//el fetch de deigo con la ruta para buscar las citas del cliente, el método y el formato :)
      const { data, error: fetchError } = await useApiFetchDiego(`/buscar-citas-cliente${query}`)
        .get()
        .json()
        //lo mismo de siempre, si trae error pues no entra a lo demás y tira este error vdd
      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudieron buscar las citas')
      }
//aquí se agarra la coleccion de las citas desde el back, contempla las diferentes estructuras de la respsuesta
//si no llega na, pues agarra el arreglo vacío para q no truene
//si, usé el autocompletado de vsc para escibirlo de nuevo JAJJAJAJ
      citasCliente.value = data.value?.data?.data || data.value?.data || []
      //regresa las citas relacionadas al cliente 
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
//Pa updatear al cliente jsjjs
//recibe su id, y el payload de actualización... el q está arriba 
  async function actualizarCliente(id: number, payload: ActualizarClientePayload) {
    loading.value = true
    error.value = ''
    mensaje.value = ''

    try {
      //el fetch de diego otra vez :)
      const { data, error: fetchError } = await useApiFetchDiego(`/clientes/${id}`)
        .put(payload)
        .json()
//lo mismo...
      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'No se pudo actualizar el cliente')
      }
//el msj de exito 
      mensaje.value = data.value?.message || 'Cliente actualizado correctamente'
      //lo mismo q en lo de crear cliente, es para actualizar el front 
      await buscarClientes()
      //regresa el cliente y le dice a ts q es un cliente o undefined :)
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
