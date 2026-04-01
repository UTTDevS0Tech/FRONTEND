<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { Servicio, TipoServicio } from '@/types'

const props = defineProps<{
//viene del papá, si tiene id es edición, si no, es creación
  modelValue?: TipoServicio | null
  //para la lista de servicios del select
  servicios: Servicio[]
  //variable booleana para checar cuando esta cargando, ayuda pal disño y que evite mandar muchas peticiones el usuario
  //pqp ues siempre es el error de capa 8 jajaj
  cargando?: boolean
}>()

//estas madres son los eventos que se van a mandar de aquí al papá
const emit = defineEmits<{
  //es el formulario listo para ejecutarse 
  (e: 'submit', payload: FormData): void
  //esto es para cuando se limpia el formulario o se cancela la edición
  //para que el papá sepa y pueda limpiar el formulario 
  (e: 'cancel'): void
}>()

//esto es lo q nos dijo ramiro de la reactividad, de cuando un usuario escribe algo en el formulario
//reactive hace que el objeto formulario sea reactivo, osea que vue lo observe y 
// cuando cambie algo en el formulario, vue se de cuenta y actualice la vista
const formulario = reactive({
  nombre: '',
  descripcion: '',
  precio: 0,
  tiempo_estimado: 1,
  activo: true,
  servicio_id: 0,
  imagen: null as File | null
})
//el computed se usa cuando sus dependdencias cambian sjjsjs 
//en este caso lo estoy usando pa wachar que haya un id en el formulario pa checar si estas editando o no 
const editando = computed(() => {
  if (props.modelValue && props.modelValue.id) {
    return true
  } else {
    return false
  }
})

//el watch sirve para observar un valor reactivo y así poder ejecutar una función cuando estos camnbien
//es como decirle a vue que este wachando esos valores y que cuando cambien, haga algo 

watch(
  //aquí estamos vigilando lo que es el props.modelvalue, 
  // cada vez que esto cambie desde el papá, el watch va a correr
  () => props.modelValue,
  //este valor es el nuevo que está en el modelValue ok?
  //es como decir, cuando el modelValue cambie, traeme su nuevo valor
  (valor) => {
    //este es el callback, lo que hace esto es copiar lo que viene del papá al formulario
    // cuando se selecciona el botón de editar en la lista de los tipos de servicio, el vue wacha que id
    //ya no es nuelo, entonces cambia los valores que hay en el formulario 
    formulario.nombre = valor?.nombre ?? ''
    formulario.descripcion = valor?.descripcion ?? ''
    formulario.precio = valor?.precio ?? 0
    formulario.tiempo_estimado = valor?.tiempo_estimado ?? 1
    formulario.activo = valor?.activo ?? true
    formulario.servicio_id = valor?.servicio_id ?? 0
    formulario.imagen = null
  },
  {immediate: true}
 )
 //resetea el formulario y le avisa al papá que tambien cambie
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
//el evento es el evento del input (el @change)
function manejarArchivo(event: Event) {
  //vamos a obtener el valor que cambió en el input
  //el event.target es el <input type="file">
  //el HTML InputElement es pq typescript nos odia y no confía en nodotros, entonces hay q decirle
  //confía en mi, es un input vro 
  const input = event.target as HTMLInputElement
  formulario.imagen = input.files?.[0] ?? null
}

function guardarTipoServicio() {
  //aquí hago esto por todo el rollo de que subimos un archivi¿o (la imagen)
  const formData = new FormData()
  //el append es pa agregar ese dato al formulario que tenga esa clave
  formData.append('nombre', formulario.nombre)
  formData.append('descripcion', formulario.descripcion)
  formData.append('precio', String(formulario.precio))
  formData.append('tiempo_estimado', String(formulario.tiempo_estimado))
  formData.append('activo', formulario.activo ? '1' : '0')
  formData.append('servicio_id', String(formulario.servicio_id))

  if (formulario.imagen) {
    formData.append('imagen', formulario.imagen)
  }
  //lo mandamos al papá
  emit('submit', formData)
}
</script>

<template>
  <div class="servicios-panel formulario-panel">
    <h3>{{ editando ? 'Formulario de edición' : 'Nuevo tipo de servicio' }}</h3>

    <form class="servicio-form" @submit.prevent="guardarTipoServicio">
      <div class="form-group">
        <label>Nombre del tipo de servicio</label>
        <input
          v-model="formulario.nombre"
          type="text"
          placeholder="Ej. Corte premium"
          required
        />
      </div>

      <div class="form-group">
        <label>Descripción</label>
        <textarea
          v-model="formulario.descripcion"
          rows="4"
          placeholder="Describe este tipo de servicio"
        />
      </div>

      <div class="form-group">
        <label>Servicio base</label>
        <select v-model.number="formulario.servicio_id" required>
          <option :value="0" disabled>Selecciona un servicio</option>
          <option
            v-for="servicio in servicios"
            :key="servicio.id"
            :value="servicio.id"
          >
            {{ servicio.nombre }}
          </option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group compact-group">
          <label>Precio</label>
          <input
            v-model.number="formulario.precio"
            type="number"
            min="0"
            step="0.01"
            placeholder="Ej. 250"
            required
          />
        </div>

        <div class="form-group compact-group">
          <label>Tiempo estimado (min)</label>
          <input
            v-model.number="formulario.tiempo_estimado"
            type="number"
            min="1"
            placeholder="Ej. 60"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label>Imagen</label>
        <input
          type="file"
          accept="image/*"
          @change="manejarArchivo"
        />
      </div>

      <div class="form-group check-group">
        <label class="checkbox-wrap">
          <input
            v-model="formulario.activo"
            type="checkbox"
          />
          <span>Tipo de servicio activo</span>
        </label>
      </div>

      <div class="acciones-formulario">
        <button type="submit" :disabled="cargando">
          {{ editando ? 'Actualizar tipo de servicio' : 'Crear tipo de servicio' }}
        </button>

        <button
          type="button"
          class="secondary"
          :disabled="cargando"
          @click="limpiarFormulario"
        >
          Limpiar
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.servicios-panel {
  background: rgba(255, 255, 255, 0.62);
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
  height: 100%;
  min-height: 640px;
  display: flex;
  flex-direction: column;
}

.servicios-panel h3 {
  margin: 0 0 16px;
  font-size: 1.5rem;
  color: #5f4b3a;
}

.servicio-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
}

.compact-group {
  min-width: 0;
}

.form-group label {
  color: #5f4b3a;
  font-weight: 800;
  font-size: 0.95rem;
}

input[type="text"],
input[type="number"],
select,
textarea,
input[type="file"] {
  width: 100%;
  min-width: 0;
  padding: 12px 13px;
  border-radius: 14px;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: rgba(255, 255, 255, 0.92);
  color: #5f4b3a;
  font-size: 0.94rem;
  outline: none;
  transition: 0.25s ease;
  font-family: inherit;
}

textarea {
  resize: vertical;
  min-height: 92px;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus,
textarea:focus,
input[type="file"]:focus {
  border-color: #D4A373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
  transform: translateY(-1px);
}

.check-group {
  flex-direction: row;
  align-items: center;
}

.checkbox-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #5f4b3a;
}

.checkbox-wrap input {
  width: 18px;
  height: 18px;
  accent-color: #D4A373;
}

.acciones-formulario {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: auto;
}

button {
  padding: 11px 14px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 800;
  transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
  font-size: 0.95rem;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.acciones-formulario button {
  background: linear-gradient(135deg, #D4A373, #bf8c5a);
  color: white;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.25);
}

.acciones-formulario button.secondary {
  background: linear-gradient(135deg, #CCD5AE, #b8c493);
  color: #5f4b3a;
  box-shadow: 0 14px 24px rgba(179, 192, 136, 0.22);
}

@media (max-width: 780px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>