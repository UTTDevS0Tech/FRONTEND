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
    <section class="recepcionista-shell">
      <div class="recepcionista-layout">
        <aside class="recepcionista-sidebar">
          <span class="panel-tag">Recepción</span>
          <h1>Cliente para cita</h1>
          <p>
            Antes de agendar una cita de escritorio, registra un cliente nuevo
            o selecciona uno ya existente.
          </p>

          <div class="sidebar-stats">
            <h2>3 pasos</h2>
            <div class="stat-card">
              <strong>1</strong>
              <span>Registrar cliente</span>
            </div>

            <div class="stat-card">
              <strong>2</strong>
              <span>Seleccionar cliente</span>
            </div>

            <div class="stat-card">
              <strong>3</strong>
              <span>Continuar a la cita</span>
            </div>
          </div>
        </aside>

        <section class="recepcionista-content">
          <div class="top-actions">
            <router-link to="/dashboard/personal" class="back-btn">
              ← Volver al dashboard
            </router-link>
          </div>

          <div class="page-header">
            <h2>Crear o seleccionar cliente</h2>
            <p>
              Completa el formulario para registrar un cliente nuevo o usa el
              buscador para seleccionar uno existente.
            </p>
          </div>

          <div class="content-card">
            <div class="card-header">
              <div>
                <h3>Nuevo cliente</h3>
                <span>Captura los datos básicos del cliente</span>
              </div>
            </div>

            <ClienteRecepcionistaForm
              :formulario="formulario"
              @submit="crear"
            />

            <div class="acciones-secundarias">
              <button class="btn secondary" @click="abrirModal">
                Seleccionar cliente existente
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>

    <transition name="fade">
      <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal">
          <div class="modal-header">
            <div>
              <h2>Seleccionar cliente existente</h2>
              <p>Busca por nombre o apellidos para continuar con la cita.</p>
            </div>

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
    </transition>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.recepcionista-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 22px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
  color: #5f4b3a;
}

.recepcionista-shell {
  width: min(1680px, 100%);
  animation: pageEnter 0.8s ease;
}

.recepcionista-layout {
  display: grid;
  grid-template-columns: 270px 1fr;
  min-height: 780px;
  border-radius: 30px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.56);
  border: 1px solid rgba(255, 255, 255, 0.52);
  box-shadow: 0 22px 60px rgba(92, 75, 59, 0.14);
  backdrop-filter: blur(16px);
}

.recepcionista-sidebar {
  padding: 34px 24px;
  background: linear-gradient(180deg, #ccd5ae 0%, #e9edc9 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.panel-tag {
  display: inline-block;
  width: fit-content;
  margin-bottom: 24px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.42);
  color: #6d5844;
  font-weight: 800;
  font-size: 0.95rem;
}

.recepcionista-sidebar h1 {
  margin: 0 0 16px;
  font-size: 2.3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.recepcionista-sidebar p {
  margin: 0 0 24px;
  color: #7b6a58;
  line-height: 1.7;
  font-size: 0.95rem;
}

.sidebar-stats {
  display: grid;
  gap: 18px;
  margin-top: 12px;
}

.stat-card {
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.45);
  box-shadow: 0 10px 24px rgba(92, 75, 59, 0.08);
}

.stat-card strong {
  display: block;
  margin-bottom: 8px;
  font-size: 1.8rem;
  color: #5f4b3a;
}

.stat-card span {
  color: #7b6a58;
  font-weight: 600;
}

.recepcionista-content {
  padding: 24px 28px;
  background: rgba(254, 250, 224, 0.88);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top-actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.back-btn {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 0.95rem;
  text-decoration: none;
  transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
  background: rgba(204, 213, 174, 0.55);
  color: #5f4b3a;
  box-shadow: 0 10px 20px rgba(92, 75, 59, 0.08);
}

.back-btn:hover {
  transform: translateY(-2px);
  background: rgba(204, 213, 174, 0.78);
  box-shadow: 0 14px 24px rgba(92, 75, 59, 0.12);
}

.page-header {
  display: grid;
  gap: 0.35rem;
}

.page-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #5f4b3a;
}

.page-header p {
  margin: 0;
  color: #8a7764;
  font-size: 0.95rem;
}

.content-card {
  background: rgba(255, 255, 255, 0.62);
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 14px 30px rgba(92, 75, 59, 0.08);
  border: 1px solid rgba(236, 231, 216, 0.7);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.card-header h3 {
  margin: 0 0 6px;
  font-size: 1.35rem;
  color: #5f4b3a;
}

.card-header span {
  color: #8a7764;
  font-weight: 700;
  font-size: 0.95rem;
}

.acciones-secundarias {
  margin-top: 18px;
  display: flex;
  justify-content: flex-start;
}

.btn {
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.95rem;
  transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn.primary {
  padding: 10px 16px;
  background: #D4A373;
  color: white;
  box-shadow: 0 14px 26px rgba(212, 163, 115, 0.25);
}

.btn.secondary {
  padding: 10px 16px;
  background: linear-gradient(135deg, #ccd5ae, #b8c493);
  color: #5f4b3a;
  box-shadow: 0 14px 24px rgba(179, 192, 136, 0.22);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(71, 58, 45, 0.35);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 200;
}

.modal {
  width: min(860px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 28px;
  background: rgba(254, 250, 224, 0.98);
  box-shadow: 0 28px 60px rgba(92, 75, 59, 0.22);
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
}

.modal-header h2 {
  margin: 0 0 6px;
  font-size: 1.5rem;
  color: #5f4b3a;
}

.modal-header p {
  margin: 0;
  color: #8a7764;
}

.close-btn {
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 900;
  background: rgba(255, 226, 226, 0.95);
  color: #a14444;
}

.close-btn:hover {
  transform: translateY(-2px);
}

.modal-body {
  display: grid;
  gap: 16px;
}

.buscador {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
}

.buscador input {
  width: 100%;
  min-width: 0;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: rgba(255, 255, 255, 0.92);
  color: #5f4b3a;
  font-size: 0.95rem;
  outline: none;
}

.buscador input:focus {
  border-color: #D4A373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.14);
}

.loading,
.sin-resultados {
  padding: 18px 4px;
  color: #8a7764;
  font-weight: 600;
}

.lista-clientes {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.cliente-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(236, 231, 216, 0.7);
}

.cliente-info strong {
  display: block;
  color: #5f4b3a;
  margin-bottom: 4px;
}

.cliente-info p {
  margin: 0;
  color: #8a7764;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1250px) {
  .recepcionista-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .recepcionista-page {
    padding: 1rem;
  }

  .content-card,
  .modal {
    padding: 1rem;
  }

  .buscador,
  .cliente-item {
    grid-template-columns: 1fr;
    display: grid;
  }

  .page-header h2 {
    font-size: 1.5rem;
  }
}
</style>