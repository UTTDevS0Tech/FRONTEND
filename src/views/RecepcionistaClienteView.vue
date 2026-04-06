<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRecepcionistaStore } from '@/stores/recepcionista'
import ClienteRecepcionistaForm from '@/components/ClienteRecepcionistaForm.vue'

const router = useRouter()
const recepcionistaStore = useRecepcionistaStore()

const search = ref('')
const modalAbierto = ref(false)

const formulario = reactive({
  nom: '',
  apellido_p: '',
  apellido_m: '',
  tel: '',
})

onMounted(() => {
  recepcionistaStore.buscarClientes()
})

async function crear() {
  const cliente = await recepcionistaStore.crearCliente({ ...formulario })

  if (!cliente?.id) return

  router.push({
    name: 'dashboard/personal/citas-escritorio',
    query: { cliente_id: String(cliente.id) },
  })
}

async function buscar() {
  await recepcionistaStore.buscarClientes(search.value)
}

function seleccionar(cliente: any) {
  recepcionistaStore.seleccionarCliente(cliente)

  router.push({
    name: 'dashboard/personal/citas-escritorio',
    query: { cliente_id: String(cliente.id) },
  })
}

function abrirModal() {
  modalAbierto.value = true
  recepcionistaStore.buscarClientes()
}

function cerrarModal() {
  modalAbierto.value = false
  search.value = ''
}
</script>

<template>
  <main class="recepcionista-page">
    <section class="card">
      <h1>Crear o seleccionar cliente</h1>
      <p>
        Antes de agendar una cita de escritorio, registra o elige al cliente.
      </p>

      <ClienteRecepcionistaForm
        :formulario="formulario"
        @submit="crear"
      />

      <div class="acciones-secundarias">
        <button class="btn secondary" @click="abrirModal">
          Seleccionar cliente existente
        </button>
      </div>
    </section>

    <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Seleccionar cliente existente</h2>
          <button class="close-btn" @click="cerrarModal">✕</button>
        </div>

        <div class="modal-body">
          <div class="buscador">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar por nombre o apellidos..."
              @keyup.enter="buscar"
            />
            <button class="btn primary" @click="buscar">
              Buscar
            </button>
          </div>

          <div v-if="recepcionistaStore.loading" class="loading">
            Buscando clientes...
          </div>

          <ul
            v-else-if="recepcionistaStore.clientes.length"
            class="lista-clientes"
          >
            <li
              v-for="cliente in recepcionistaStore.clientes"
              :key="cliente.id"
              class="cliente-item"
            >
              <div class="cliente-info">
                <strong>
                  {{ cliente.nom }} {{ cliente.apellido_p }} {{ cliente.apellido_m }}
                </strong>
                <p>{{ cliente.tel || 'Sin teléfono' }}</p>
              </div>

              <button class="btn primary" @click="seleccionar(cliente)">
                Seleccionar
              </button>
            </li>
          </ul>

          <p v-else class="sin-resultados">
            No se encontraron clientes.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>