<script setup lang="ts">
interface ClienteFormData {
  nom: string
  apellido_p: string
  apellido_m: string
  tel: string
  email?: string
}

defineProps<{
  formulario: ClienteFormData
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()
</script>

<template>
  <form class="cliente-form" @submit.prevent="emit('submit')">
    <div class="grid">
      <input v-model="formulario.nom" placeholder="Nombre" />
      <input v-model="formulario.apellido_p" placeholder="Apellido paterno" />
      <input v-model="formulario.apellido_m" placeholder="Apellido materno" />
      <input v-model="formulario.tel" placeholder="Teléfono" />
    </div>

    <div class="acciones">
      <button type="submit" class="btn primary">
        Crear
      </button>
    </div>
  </form>
</template>