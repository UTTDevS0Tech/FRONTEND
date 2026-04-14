import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { EstilistaCita } from '@/types'
import { useApiFetchDiego } from '@/composables/useApi'





export const usePersonalCitasStore = defineStore('personalcitas', () => {
 const citas = ref<EstilistaCita[]>([])
 const mensajeError = ref('')



 async function obtenerCitasDePersonal() {
    mensajeError.value= ''
    
try{
    const {data, error: fetchError} = await useApiFetchDiego('verMisCitasComoEstilista').get().json()

        if(fetchError.value) {

            mensajeError.value = "hubo error al traer citas"
            console.log("error", fetchError);
            return;

        }

        if(!fetchError.value && data.value && data.value.data) {
            citas.value = data.value.data
            console.log("citas encontradas", citas.value)
        }
     } catch(e: any) {
            console.log(e, "error");
     
        }
    }
    

      






  return {
            mensajeError,
             obtenerCitasDePersonal,
            citas
        }

 


})




