import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiFetchDiego } from '@/composables/useApi'
import type {ApiResponse, AdminPersonal, AdminPersonalPayload, AdminPersonalUpdatePayload,} from '@/types'
import { C } from 'vue-router/dist/options-BErt5RTe.cjs'

export const useAdminPersonalStore = defineStore('admin-personal', () => {
const personales = ref<AdminPersonal[]>([])
const personal = ref<AdminPersonal | null>(null)
const cargando = ref(false)
const error = ref<string | null>(null)
const mensaje = ref<string | null>(null)


async function obtenerPersonales(){
    cargando.value=true
    error.value=null

    try{
        const {data, error:fetchError}=await useApiFetchDiego('personal').get().json<ApiResponse<AdminPersonal[]>>()
        if(fetchError){
            throw fetchError.value
        }   
        personales.value=data.value?.data || []
        mensaje.value=data.value?.message || null

    }catch (err: any) {
        error.value=err?.message ?? 'Error al obtener personales'
    } finally {
        cargando.value=false
    }
}
    async function obtenerPersonalPorId(id: number){
        cargando.value=true
        error.value=null

        try{
            const {data, error:fetchError}=await useApiFetchDiego(`personal/${id}`).get().json<ApiResponse<AdminPersonal>>()
            if(fetchError){
                throw fetchError.value
            }
            personal.value=data.value?.data || null
            mensaje.value=data.value?.message || null
            return personal.value

        }catch (err: any) {
            error.value=err?.message ?? 'Error al obtener personal'
        }   finally {
            cargando.value=false
        }   
    }

    async function crearPersonal(payload: AdminPersonalPayload){
        cargando.value=true
        error.value=null
        try{
            const {data, error:fetchError}=await useApiFetchDiego('personal').post({body: payload}).json<ApiResponse<AdminPersonal>>()
            if(fetchError){
                throw fetchError.value
            }   
            personal.value=data.value?.data || null
            mensaje.value=data.value?.message ?? 'Personal creado exitosamente'
            return personal.value
        }catch (err: any) {
            error.value=err?.message ?? 'Error al crear personal'
        } finally {
            cargando.value=false
        }
    }

    async function actualizarPersonal(id: number, payload: AdminPersonalUpdatePayload){
        cargando.value=true
        error.value=null
    
        try{
            const {data, error:fetchError}=await useApiFetchDiego(`personal/${id}`).put({body: payload}).json<ApiResponse<AdminPersonal>>()
            if(fetchError){
                throw fetchError.value
            }
            personal.value=data.value?.data || null
            mensaje.value=data.value?.message ?? 'Personal actualizado exitosamente'
            return personal.value
        }catch (err: any) {
            error.value=err?.message ?? 'Error al actualizar personal'
        } finally {
            cargando.value=false
        }   
    }
    function limpiarMensaje(){
    error.value=null
    mensaje.value=null
  }
    return {
        personales,
        personal,
        cargando,   
        error,
        mensaje,        
        obtenerPersonales,
        obtenerPersonalPorId,
        crearPersonal,
        actualizarPersonal,
        limpiarMensaje
    }
})





