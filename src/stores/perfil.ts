import {defineStore} from 'pinia'
import {ref} from 'vue'
import { useApiFetchDiego } from '@/composables/useApi'
import type {PerfilCliente, PerfilClientePayload, FormularioPerfilCliente} from '@/types'
import { findAncestor } from 'typescript'

export const usePerfilStore= defineStore('perfil', ()=>{
const perfil =ref<PerfilCliente | null> (null)
const loading = ref(false)
const error = ref('')
const mensaje = ref('')


function extraerMensajeError(fetchError:any, fallback:string): string {
const errData=fetchError?.data

if(errData?.errors){
return Object.values(errData.errors).flat().join(' |')as string
}

if(errData?.message){
return errData.message as string
}

return fallback

}


async function obtenerPerfil() {
loading.value=true
error.value=''
mensaje.value=''


try{

const {data, error:fetchError}=await useApiFetchDiego('/ver-perfil').get().json()

if(fetchError.value){
throw new Error(extraerMensajeError(fetchError.value,'Error al obtener el perfil'))
}

perfil.value = data.value?.data??null
return perfil.value

}catch(err:any){
error.value=err.message || 'Error al obtener el perfil'    
}
finally{
loading.value=false 
}
}


async function actuailizarPerfil(payload:PerfilClientePayload){
loading.value=true
error.value=''
mensaje.value=''

try{

    const {data, error:fetchError}=await useApiFetchDiego('/editar-perfil').patch(payload).json()
if(fetchError.value){
throw new Error(extraerMensajeError(fetchError.value,'Error al actualizar el perfil'))
}
perfil.value=data.value?.data??null
mensaje.value=data.value?.message||'Perfil actualizado correctamente'
return perfil.value
}catch(err:any){
error.value=err.message || 'Error al actualizar el perfil'      
} finally{
loading.value=false
}

}

function construirFormulario(){
return {
nom:perfil.value?.cliente?.nom || '',
apellido_p:perfil.value?.cliente?.apellido_p || '',
apellido_m:perfil.value?.cliente?.apellido_m || '',
email:perfil.value?.email || '',    
}
}

function limpiarMensaje(){

    error.value=''
    mensaje.value=''
}

return{
perfil,
loading,
error,
mensaje,
obtenerPerfil,
actuailizarPerfil,
construirFormulario,
limpiarMensaje
}

})