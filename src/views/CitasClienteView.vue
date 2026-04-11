<script setup lang="ts">
import CitasClienteForm from '@/components/CitasClienteForm.vue'
</script>

<template>
  <main class="citas-page">
    <section class="citas-shell">
      <div class="citas-layout">
        <aside class="citas-sidebar">
          <span class="panel-tag">Reservación</span>
          <h1>Citas</h1>
          <p>
            Agenda tu cita de forma rápida y sencilla. Selecciona a tu estilista,
            el horario que prefieras y los servicios que deseas reservar.
          </p>

          <div class="sidebar-stats">
            <div class="stat-card">
              <strong>Nueva cita</strong>
              <span>Organiza tu próxima visita a la estética</span>
            </div>

            <div class="stat-card">
              <strong>Servicios</strong>
              <span>Elige hasta 3 servicios para tu reservación</span>
            </div>
          </div>
        </aside>

        <section class="citas-content">
          <div class="top-actions">
            <router-link to="/dashboard/cliente" class="back-btn">
              ← Volver a la página principal
            </router-link>
          </div>

          <div class="page-header">
            <h2>Agenda tu cita</h2>
            <p>Completa la información para confirmar tu visita.</p>
          </div>

          <div class="content-card">
            <CitasClienteForm />
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.citas-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 22px;
  background: linear-gradient(135deg, #fefae0 0%, #faedcd 58%, #e9edc9 100%);
}

.citas-shell {
  width: min(1680px, 100%);
  animation: pageEnter 0.8s ease;
}

.citas-layout {
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

.citas-sidebar {
  padding: 34px 24px;
  background: linear-gradient(180deg, #ccd5ae 0%, #e9edc9 100%);
  display: flex;
  flex-direction: column;
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

.citas-sidebar h1 {
  margin: 0 0 16px;
  font-size: 2.3rem;
  line-height: 1.05;
  color: #5f4b3a;
}

.citas-sidebar p {
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
  font-size: 1.2rem;
  color: #5f4b3a;
}

.stat-card span {
  color: #7b6a58;
  font-weight: 600;
}

.citas-content {
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

.page-header h2 {
  margin: 0 0 6px;
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
  min-height: 620px;
}

/* AQUI ESTA LA MAGIA */
.content-card :deep(.cita-form) {
  display: grid;
  gap: 1.25rem;
}

.content-card :deep(.form-section),
.content-card :deep(.resumen) {
  background: #f6f4ec;
  border: 1px solid rgba(212, 163, 115, 0.16);
  border-radius: 24px;
  padding: 1.2rem;
}

.content-card :deep(.section-title) {
  margin-bottom: 1rem;
}

.content-card :deep(.section-title h3) {
  margin: 0.35rem 0 0.35rem;
  color: #6b5440;
  font-size: 1.4rem;
  font-weight: 500;
}

.content-card :deep(.section-title p) {
  margin: 0;
  color: #9a826f;
  line-height: 1.55;
  font-size: 0.95rem;
}

.content-card :deep(.section-badge) {
  display: inline-flex;
  align-items: center;
  padding: 0.38rem 0.75rem;
  border-radius: 999px;
  background: rgba(212, 163, 115, 0.14);
  color: #c27d42;
  font-size: 0.78rem;
  font-weight: 800;
}

.content-card :deep(.field-grid) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.content-card :deep(.field),
.content-card :deep(.servicios-grid) {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.content-card :deep(label) {
  font-weight: 800;
  color: #5f4b3a;
  font-size: 0.92rem;
}

.content-card :deep(.selected-value) {
  color: #d09a67;
  font-weight: 700;
}

.content-card :deep(input),
.content-card :deep(select) {
  width: 100%;
  padding: 0.92rem 1rem;
  border: 1px solid rgba(212, 163, 115, 0.2);
  border-radius: 14px;
  background: #fbfaf6;
  color: #6a5644;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.content-card :deep(input:focus),
.content-card :deep(select:focus) {
  border-color: #d4a373;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.1);
  background: #fff;
}

.content-card :deep(.info-box) {
  padding: 0.95rem 1rem;
  border-radius: 16px;
  background: rgba(250, 237, 205, 0.6);
  color: #7b6652;
  border: 1px dashed rgba(212, 163, 115, 0.28);
  font-size: 0.92rem;
}

.content-card :deep(.info-box.empty) {
  background: rgba(255, 243, 243, 0.72);
  color: #9d5b5b;
}

.content-card :deep(.botones-horas) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.content-card :deep(.btn-hora) {
  min-width: 90px;
  padding: 0.8rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(212, 163, 115, 0.18);
  background: #fbfaf7;
  color: #7b6652;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
}

.content-card :deep(.btn-hora:hover) {
  background: #fff;
  border-color: rgba(212, 163, 115, 0.35);
}

.content-card :deep(.seleccionado-negro) {
  background: #6b5440 !important;
  color: #fff !important;
  border-color: #6b5440 !important;
  box-shadow: 0 10px 22px rgba(95, 75, 58, 0.14);
}

.content-card :deep(.botones-servicios) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.content-card :deep(.btn-servicio) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  padding: 1rem;
  text-align: left;
  border-radius: 14px;
  border: 1px solid rgba(212, 163, 115, 0.16);
  background: #fbfaf7;
  color: #5f4b3a;
  cursor: pointer;
  transition: all 0.2s ease;
}

.content-card :deep(.btn-servicio:hover) {
  border-color: rgba(212, 163, 115, 0.35);
  background: #fff;
}

.content-card :deep(.btn-servicio.seleccionado) {
  background: linear-gradient(135deg, #faedcd, #fefae0);
  border-color: #d4a373;
}

.content-card :deep(.servicio-nombre) {
  font-weight: 800;
}

.content-card :deep(.servicio-precio) {
  color: #c27d42;
  font-weight: 800;
  font-size: 0.9rem;
}

.content-card :deep(.resumen-header) {
  margin-bottom: 0.9rem;
}

.content-card :deep(.resumen-header h3) {
  margin: 0 0 0.3rem;
  color: #5f4b3a;
  font-size: 1.1rem;
}

.content-card :deep(.resumen-header p) {
  margin: 0;
  color: #8a725c;
  font-size: 0.92rem;
}

.content-card :deep(.resumen-card) {
  padding: 1rem;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(250, 237, 205, 0.68), rgba(255, 255, 255, 0.92));
  border: 1px solid rgba(212, 163, 115, 0.18);
}

.content-card :deep(.resumen-row) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #5f4b3a;
  padding: 0.42rem 0;
}

.content-card :deep(.btn-agendar) {
  width: 100%;
  margin-top: 0.9rem;
  border: none;
  border-radius: 16px;
  padding: 0.95rem 1.1rem;
  background: linear-gradient(135deg, #d4a373, #bf8c5a);
  color: white;
  font-weight: 900;
  font-size: 0.96rem;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  box-shadow: 0 12px 24px rgba(212, 163, 115, 0.2);
}

.content-card :deep(.btn-agendar:hover) {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px rgba(212, 163, 115, 0.28);
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
  .citas-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .content-card :deep(.field-grid),
  .content-card :deep(.botones-servicios) {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .citas-page {
    padding: 14px;
  }

  .citas-content {
    padding: 18px;
  }

  .content-card {
    padding: 18px;
    border-radius: 22px;
  }

  .citas-sidebar h1 {
    font-size: 2rem;
  }
}
</style>