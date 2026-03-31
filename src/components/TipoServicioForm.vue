<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { Servicio, TipoServicio } from '@/types'

const props = defineProps<{
  modelValue?: TipoServicio | null
  servicios: Servicio[]
  cargando?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: FormData): void
  (e: 'cancel'): void
}>()

const formulario = reactive({
  nombre: '',
  descripcion: '',
  precio: 0,
  tiempo_estimado: 1,
  activo: true,
  servicio_id: 0,
  imagen: null as File | null
})

const editando = computed(() => !!props.modelValue?.id)

watch(
  () => props.modelValue,
  (valor) => {
    formulario.nombre = valor?.nombre ?? ''
    formulario.descripcion = valor?.descripcion ?? ''
    formulario.precio = valor?.precio ?? 0
    formulario.tiempo_estimado = valor?.tiempo_estimado ?? 1
    formulario.activo = valor?.activo ?? true
    formulario.servicio_id = valor?.servicio_id ?? 0
    formulario.imagen = null
  },
  { immediate: true }
)

function limpiarFormulario() {
  formulario.nombre = ''
  formulario.descripcion = ''
  formulario.precio = 0
  formulario.tiempo_estimado = 1
  formulario.activo = true
  formulario.servicio_id = 0
  formulario.imagen = null

  emit('cancel')
}

function manejarArchivo(event: Event) {
  const input = event.target as HTMLInputElement
  formulario.imagen = input.files?.[0] ?? null
}

function guardarTipoServicio() {
  const formData = new FormData()

  formData.append('nombre', formulario.nombre)
  formData.append('descripcion', formulario.descripcion)
  formData.append('precio', String(formulario.precio))
  formData.append('tiempo_estimado', String(formulario.tiempo_estimado))
  formData.append('activo', formulario.activo ? '1' : '0')
  formData.append('servicio_id', String(formulario.servicio_id))

  if (formulario.imagen) {
    formData.append('imagen', formulario.imagen)
  }

  emit('submit', formData)
}
</script>
<template></template>

<style></style>

