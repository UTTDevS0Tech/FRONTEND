<script setup>
import { onMounted, reactive } from 'vue'
import { usePerfilStore } from '@/stores/perfil'

const perfilStore = usePerfilStore()

const formulario = reactive({
nom:'',
apellido_p:'',
apellido_m:'',
email:'',

})

onMounted(async ()=>{

await perfilStore.obtenerPerfil()
const datos= perfilStore.construirFormulario()
formulario.nom=datos.nom
formulario.apellido_p=datos.apellido_p
formulario.apellido_m=datos.apellido_m
formulario.email=datos.email
})

async function guardarCambios(){
 
    await perfilStore.actualizarPerfil({
        nom: formulario.nom,
        apellido_p: formulario.apellido_p,
        apellido_m: formulario.apellido_m,
        email: formulario.email
    })
}

</script>

<template>
  <main class="perfil-page">
    <section class="perfil-card">
      <div class="perfil-header">
        <h1>Mi perfil</h1>
        <p>Actualiza tu información personal.</p>
      </div>

      <div v-if="perfilStore.error" class="alert error">
        {{ perfilStore.error }}
      </div>

      <div v-if="perfilStore.mensaje" class="alert success">
        {{ perfilStore.mensaje }}
      </div>

      <form class="perfil-form" @submit.prevent="guardarCambios">
        <div class="grid">
          <div class="field">
            <label>Nombre</label>
            <input v-model="formulario.nom" type="text" />
          </div>

          <div class="field">
            <label>Apellido paterno</label>
            <input v-model="formulario.apellido_p" type="text" />
          </div>

          <div class="field">
            <label>Apellido materno</label>
            <input v-model="formulario.apellido_m" type="text" />
          </div>

          <div class="field">
            <label>Correo electrónico</label>
            <input v-model="formulario.email" type="email" />
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="perfilStore.loading">
          Guardar cambios
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.perfil-page {
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
}

.perfil-card {
  max-width: 900px;
  margin: 0 auto;
  padding: 28px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 20px 50px rgba(92, 75, 59, 0.12);
}

.perfil-header h1,
.perfil-header p {
  margin: 0;
}

.perfil-header {
  display: grid;
  gap: 8px;
  margin-bottom: 24px;
}

.perfil-form {
  display: grid;
  gap: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.field {
  display: grid;
  gap: 8px;
}

.field label {
  font-weight: 700;
  color: #5f4b3a;
}

.field input {
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(212, 163, 115, 0.25);
  background: white;
  color: #5f4b3a;
  outline: none;
}

.submit-btn {
  border: none;
  border-radius: 16px;
  padding: 14px 18px;
  font-weight: 800;
  cursor: pointer;
  background: #d4a373;
  color: white;
}

.alert {
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 600;
}

.alert.error {
  background: rgba(255, 228, 228, 0.9);
  color: #991b1b;
}

.alert.success {
  background: rgba(204, 213, 174, 0.35);
  color: #3f5b2d;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>