import {defineStore} from 'pinia'
import {ref} from 'vue'
import { useApiFetchDiego } from '@/composables/useApi'
import type { ApiResponse, AdminUser, AdminUserPayload, AdminUserUpdatePayload } from '@/types'

export const useAdminUserStore= defineStore('admin-user', ()=>{
  const usuarios=ref<AdminUser[]>([])
  const usuario=ref<AdminUser | null>(null)
  const cargando=ref(false)   
  const error=ref<string | null>(null)
  const mensaje=ref<string | null>(null)

  async function obtenerUsuariosPorRol(rol: string){
    cargando.value=true
    error.value=null

    try{  
        const {data, error:fetchError}=await useApiFetchDiego(`users/rol/${rol}`).get().json<ApiResponse<AdminUser[]>>()
        if(fetchError){
        throw fetchError.value
        }

        usuarios.value=data.value?.data || []
        mensaje.value=data.value?.message || null

    } catch (err: any) {
        error.value=err?.message ?? 'Error al obtener usuarios'
        throw err 
    } finally {
        cargando.value=false
    }
  }

  async function obtenerUsuarioPorId(id: number){
    cargando.value=true
    error.value=null
    try{
        const {data, error:fetchError}=await useApiFetchDiego(`users/${id}`).get().json<ApiResponse<AdminUser>>()

        if(fetchError){
            throw fetchError.value
        }

        usuario.value=data.value?.data || null
        mensaje.value=data.value?.message || null
    }catch (err: any) {
        error.value=err?.message ?? 'Error al obtener usuario'
        throw err
    } finally {
        cargando.value=false
    }
  }

  async function crearUsuario(payload:AdminUserPayload){
    cargando.value=true
    error.value=null
    try{

    const {data, error:fetchError}=await useApiFetchDiego('users').post({body: payload}).json<ApiResponse<AdminUser>>()
    if(fetchError){
        throw fetchError.value
    }
    mensaje.value=data.value?.message ?? 'Usuario creado exitosamente'
    return data.value?.data ?? null

    }catch (err: any) {
        error.value=err?.message ?? 'Error al crear usuario'
        throw err
    } finally {
        cargando.value=false
    }

  }

  async function actualizarUsuario(id:number, payload: AdminUserUpdatePayload){
    cargando.value=true
    error.value=null

    try{

    const payloadLimpio={...payload}
        //es para no mandar contraseñas vacías, si el admin no quiere cambiar la contraseña, 
        //no se las mandamos al backend, así evitamos errores de validación
    if (!payloadLimpio.password) {
        delete payloadLimpio.password
        delete payloadLimpio.password_confirmation
    }
    const {data, error:fetchError}=await useApiFetchDiego(`users/${id}`).put({body: payloadLimpio}).json<ApiResponse<AdminUser>>()
    if(fetchError){
        throw fetchError.value  
    }
    mensaje.value=data.value?.message ?? 'Usuario actualizado exitosamente'
    return data.value?.data ?? null

    }catch (err: any) {
        error.value=err?.message ?? 'Error al actualizar usuario'
        throw err
    } finally {
        cargando.value=false
    }
  }

  async function toggleUsuario(id: number){
    cargando.value=true
    error.value=null

    try{
        const {data, error}=await useApiFetchDiego(`users/${id}/toggle`).post().json<ApiResponse<AdminUser>>()
        if(error.value){
            throw error.value
        }   
        mensaje.value=data.value?.message ?? 'Estado del usuario cambiado exitosamente'
        return data.value?.data ?? null
    }catch (err: any) {
        error.value=err?.message ?? 'Error al cambiar estado del usuario'
        throw err
    } finally {
        cargando.value=false
    }

  }

  function limpiarMensaje(){
    error.value=null
    mensaje.value=null
  }

  return {
    usuarios, 
    usuario, 
    cargando, 
    error, 
    mensaje, 
    obtenerUsuariosPorRol, 
    obtenerUsuarioPorId, 
    crearUsuario, 
    actualizarUsuario, 
    toggleUsuario,
    limpiarMensaje
}
})


