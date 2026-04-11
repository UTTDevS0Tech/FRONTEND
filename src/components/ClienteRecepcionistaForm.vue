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
  submitLabel?: string
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
        {{ submitLabel || 'Crear cliente' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.cliente-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.25);
  background: rgba(255, 255, 255, 0.95);
  color: #5f4b3a;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s ease;
  font-family: inherit;
}

input::placeholder {
  color: #a08c7a;
  font-weight: 500;
}

input:hover {
  border-color: rgba(212, 163, 115, 0.5);
}

input:focus {
  border-color: #D4A373;
  box-shadow: 
    0 0 0 4px rgba(212, 163, 115, 0.15),
    0 6px 12px rgba(212, 163, 115, 0.15);
  transform: translateY(-1px);
}

.acciones {
  display: flex;
  justify-content: flex-end;
}

.btn {
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.95rem;
  transition: all 0.22s ease;
}

.btn.primary {
  padding: 12px 18px;
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.25);
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(212, 163, 115, 0.32);
}

@media (max-width: 700px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .acciones {
    justify-content: stretch;
  }

  .btn {
    width: 100%;
  }
}
</style>
