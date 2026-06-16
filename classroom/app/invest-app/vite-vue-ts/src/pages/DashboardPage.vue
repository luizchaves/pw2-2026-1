<script setup lang="ts">
import { computed } from 'vue';
import { useInvestments } from '@/composables/useInvestments';
import { formatCurrency } from '@/lib/format';
import { useVisibilityStore } from '@/stores/visibility';

const visibility = useVisibilityStore();
const { investments, isLoading } = useInvestments();

const totalAmount = computed(() =>
  investments.value.reduce((sum, investment) => sum + investment.amount, 0),
);
const totalCount = computed(() => investments.value.length);
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Dashboard</p>
        <h1 class="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
          Controle seus investimentos com clareza.
        </h1>
        <p class="mt-6 max-w-xl text-base text-slate-600">
          Acompanhe aportes, vencimentos e rendimento da sua carteira em um unico lugar.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink
            to="/investments"
            class="inline-flex h-11 items-center rounded-full bg-sky-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-sky-500"
          >
            Ver investimentos
          </RouterLink>
          <RouterLink
            to="/investments"
            class="inline-flex h-11 items-center rounded-full border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 hover:border-slate-400"
          >
            Cadastrar ativo
          </RouterLink>
        </div>
      </div>

      <article
        v-if="isLoading"
        role="status"
        aria-label="Carregando carteira"
        class="animate-pulse rounded-lg border border-slate-200 bg-white p-8"
      >
        <div class="h-4 w-32 rounded-full bg-slate-200" />
        <div class="mt-6 space-y-4">
          <div class="h-20 rounded-lg bg-slate-100" />
          <div class="h-20 rounded-lg bg-slate-100" />
        </div>
      </article>

      <article
        v-else-if="totalCount === 0"
        class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center"
      >
        <p class="text-lg font-semibold text-slate-700">Nenhum investimento ainda</p>
        <p class="mt-2 text-sm text-slate-500">
          Adicione seu primeiro ativo e comece a acompanhar sua carteira.
        </p>
        <RouterLink
          to="/investments"
          class="mt-6 inline-flex h-11 items-center rounded-full bg-sky-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-sky-500"
        >
          Cadastrar agora
        </RouterLink>
      </article>

      <article v-else class="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Resumo rapido</p>
        <div class="mt-6 space-y-4">
          <div class="rounded-lg bg-slate-50 p-4">
            <p class="text-xs uppercase tracking-[0.12em] text-slate-500">Patrimonio total</p>
            <p class="mt-2 text-2xl font-black text-slate-900">
              {{ visibility.showValues ? formatCurrency(totalAmount / 100) : '........' }}
            </p>
          </div>
          <div class="rounded-lg bg-slate-50 p-4">
            <p class="text-xs uppercase tracking-[0.12em] text-slate-500">Ativos cadastrados</p>
            <p class="mt-2 text-2xl font-black text-slate-900">
              {{ totalCount }} {{ totalCount === 1 ? 'investimento' : 'investimentos' }}
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
