<template>
  <div class="matricula-home ma-5">
    <CoreCard rounded="lg" toolbar elevation="0" class="overflow-hidden">

      <!-- Hero Header -->
      <div class="hero-banner">
        <div class="hero-content">
          <div class="hero-badge">
            <v-icon size="16" color="primary">mdi-school-outline</v-icon>
            <span>Itajaí/SC</span>
          </div>
          <h1 class="hero-title">Matrícula Online</h1>
          <p>
            Seja bem-vindo(a) ao sistema de matrículas Online do Município de Itajaí/SC.
          </p>
          <p>
            Realize sua matrícula de forma simples, rápida e segura.
          </p>
        </div>
        <div class="hero-illustration" aria-hidden="true">
          <img
            class="hero-logo"
            src="/flag_educacao.png"
            alt="Logo do Município de Itajaí/SC"
            width="220"
            height="220"
          />
        </div>
      </div>

      <v-divider />

      <!-- Body -->
      <div class="card-body">

        <!-- Important Dates -->
        <template v-if="showDates">
          <div class="section-label">
            <v-icon size="16" class="mr-1">mdi-calendar-clock-outline</v-icon>
            Datas Importantes
          </div>
          <div class="dates-list">
            <div v-for="etapa in processo.processoEtapas" :key="etapa.id" class="date-item"
              :class="{ 'date-item--active': etapa.emAndamento }">
              <div class="date-item-indicator" />
              <div class="date-item-content">
                <span class="date-item-name">{{ etapa.nome }}</span>
                <span class="date-item-range">
                  {{ getDate(etapa.faseInicialDataInicio) }}
                  às {{ getHour(etapa.faseInicialDataInicio) }}h
                  &nbsp;→&nbsp;
                  {{ getDate(etapa.faseInicialDataFim) }}
                  às {{ getHour(etapa.faseInicialDataFim) }}h
                </span>
              </div>
              <v-chip v-if="etapa.emAndamento" color="success" size="x-small" variant="tonal" class="ml-auto">
                Em andamento
              </v-chip>
            </div>
          </div>
          <v-divider class="my-5" />
        </template>

        <!-- Enrollment Buttons -->
        <template v-if="showBtn">
          <div class="section-label">
            <v-icon size="16" class="mr-1">mdi-pencil-outline</v-icon>
            Iniciar matrícula
          </div>
          <div class="enrollment-grid">
            <CoreButton v-for="p in processo" :key="p.id" :label="p.nome" :link="'/cadastro?tipo=' + p.id"
              color="primary" rounded="lg" size="x-large" block variant="flat" class="enrollment-btn" />
          </div>
          <v-divider class="my-5" />
        </template>

        <!-- Document Links -->
        <div class="section-label">
          <v-icon size="16" class="mr-1">mdi-file-document-multiple-outline</v-icon>
          Documentos
        </div>
        <div class="docs-list">
          <CoreButton :color="themeColor" :prepend-color="themeColor" :text-color="themeColor" block
            href="https://drive.google.com/file/d/1Bcfkov-puyI8xD5V04FhQBXXM6US76j6" label="Edital de Matrícula 2026"
            prepend-icon="mdi-file-document" target="_blank" variant="outlined" rounded="lg" class="doc-btn" />
        </div>

      </div>
    </CoreCard>
  </div>

  <CoreSnackbar v-model="showMessage" color="error" :message="message" @hide="showMessage = $event" />
</template>

<script setup>
import { format, utcToZonedTime } from "date-fns-tz";
import { useTheme } from "vuetify";

const theme = useTheme();
const { data: processo, error: errorProcesso } = await useFetch("/api/processos/");

const showMessage = ref(false);
const message = ref("");
const showBtn = ref(true);
const tipoCadastroSelecionado = ref(null);

const showDates = computed(() =>
  processo.value?.processoEtapas?.length
);

const themeColor = computed(() =>
  theme.global.name.value === "customLightTheme" ? "primary" : "white"
);

onMounted(() => {
  if (errorProcesso.value || processo.value?.error) {
    message.value = errorProcesso.value
      ? errorProcesso.value.message
      : processo.value.message;
    showMessage.value = true;
    return;
  }
  showBtn.value = true;
});

const getDate = (data) => {
  const utcDate = utcToZonedTime(data, "UTC");
  return format(utcDate, "dd/MM/yyyy", { timeZone: "UTC" });
};

const getHour = (data) => {
  const utcDate = utcToZonedTime(data, "UTC");
  return format(utcDate, "HH", { timeZone: "UTC" });
};
</script>

<style scoped>
/* ─── Hero Banner ───────────────────────────────────────── */
.hero-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 28px 28px;
  background: linear-gradient(135deg,
      rgba(var(--v-theme-primary), 0.06) 0%,
      rgba(var(--v-theme-primary), 0.02) 100%);
  gap: 16px;
}

.hero-content {
  flex: 1;
  min-width: 0;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-primary), 1);
  background: rgba(var(--v-theme-primary), 0.08);
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 14px;
}

.hero-title {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(var(--v-theme-on-surface), 0.9);
  line-height: 1.2;
  margin-bottom: 10px;
}

.hero-subtitle {
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.55);
  line-height: 1.6;
  max-width: 480px;
  margin: 0;
}

.hero-illustration {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 220px;
  padding: 0;
}

.hero-logo {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.08));
}

.hero-icon {
  color: rgba(var(--v-theme-primary), 0.35) !important;
}

/* ─── Body ──────────────────────────────────────────────── */
.card-body {
  padding: 24px 28px 28px;
}

/* ─── Section Label ─────────────────────────────────────── */
.section-label {
  display: flex;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.4);
  margin-bottom: 14px;
}

/* ─── Dates ─────────────────────────────────────────────── */
.dates-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  transition: background 0.2s;
}

.date-item--active {
  background: rgba(var(--v-theme-success), 0.06);
  border-color: rgba(var(--v-theme-success), 0.2);
}

.date-item-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(var(--v-theme-on-surface), 0.2);
  flex-shrink: 0;
}

.date-item--active .date-item-indicator {
  background: rgb(var(--v-theme-success));
  box-shadow: 0 0 0 3px rgba(var(--v-theme-success), 0.2);
}

.date-item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.date-item-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.date-item-range {
  font-size: 0.78rem;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

/* ─── Enrollment ────────────────────────────────────────── */
.enrollment-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.enrollment-btn {
  font-weight: 700 !important;
  letter-spacing: 0.02em !important;
}

/* ─── Docs ──────────────────────────────────────────────── */
.docs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doc-btn {
  justify-content: flex-start !important;
}

/* ─── Responsive ────────────────────────────────────────── */
@media (max-width: 600px) {
  .hero-banner {
    flex-direction: column-reverse;
    align-items: flex-start;
    padding: 20px;
  }

  .hero-illustration {
    width: 140px;
    align-self: flex-end;
  }

  .hero-icon {
    font-size: 28px !important;
  }

  .hero-title {
    font-size: 1.35rem;
  }

  .card-body {
    padding: 20px;
  }
}
</style>
