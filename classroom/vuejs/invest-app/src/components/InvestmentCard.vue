<script setup lang="ts">
import { CalendarDays, Landmark, Pencil, Trash2, TrendingUp } from 'lucide-vue-next';
import { computed } from 'vue';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Investment } from '@/schemas/investment';

const props = defineProps<{
  investment: Investment;
  showValues: boolean;
}>();

const emit = defineEmits<{
  edit: [];
  delete: [];
}>();

const categoryTheme: Record<Investment['category'], string> = {
  'Fixed Income': 'border-sky-200 bg-sky-50 text-sky-700',
  'Variable Income': 'border-amber-200 bg-amber-50 text-amber-700',
};

const categoryLabel: Record<Investment['category'], string> = {
  'Fixed Income': 'Renda Fixa',
  'Variable Income': 'Renda Variavel',
};

const amountText = computed(() =>
  props.showValues ? formatCurrency(props.investment.amount / 100) : '........',
);
</script>

<template>
  <article class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
    <header class="flex min-w-0 items-center justify-between gap-2">
      <h2 class="truncate text-base font-semibold leading-snug text-slate-950 sm:text-lg">
        {{ investment.name }}
      </h2>
      <span
        :class="[
          'h-6 shrink-0 rounded-md border px-2.5 text-xs font-semibold leading-6',
          categoryTheme[investment.category],
        ]"
      >
        {{ categoryLabel[investment.category] }}
      </span>
    </header>

    <div class="mt-4 space-y-3">
      <div class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
        <p class="text-xs font-medium text-slate-500">Valor investido</p>
        <p class="mt-0.5 text-xl font-bold leading-tight text-slate-950">{{ amountText }}</p>
      </div>

      <div class="grid gap-2">
        <div class="flex min-w-0 items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2">
          <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
            <TrendingUp class="size-3.5" />
          </span>
          <div class="min-w-0">
            <p class="text-xs font-medium text-slate-500">Rentabilidade</p>
            <p class="truncate text-sm font-semibold text-slate-900">
              {{ investment.yield ?? 'Nao informado' }}
            </p>
          </div>
        </div>

        <div class="flex min-w-0 items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2">
          <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
            <Landmark class="size-3.5" />
          </span>
          <div class="min-w-0">
            <p class="text-xs font-medium text-slate-500">Corretora</p>
            <p class="truncate text-sm font-semibold text-slate-900">{{ investment.broker }}</p>
          </div>
        </div>

        <div class="grid gap-2 sm:grid-cols-2">
          <div class="flex min-w-0 items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2">
            <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
              <CalendarDays class="size-3.5" />
            </span>
            <div class="min-w-0">
              <p class="text-xs font-medium text-slate-500">Aporte</p>
              <p class="truncate text-sm font-semibold text-slate-900">{{ formatDate(investment.investedDate) }}</p>
            </div>
          </div>
          <div class="flex min-w-0 items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2">
            <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
              <CalendarDays class="size-3.5" />
            </span>
            <div class="min-w-0">
              <p class="text-xs font-medium text-slate-500">Vencimento</p>
              <p class="truncate text-sm font-semibold text-slate-900">{{ formatDate(investment.dueDate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="mt-4 grid grid-cols-2 gap-2 border-t border-slate-200 pt-3">
      <button
        type="button"
        class="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
        aria-label="Editar investimento"
        @click="emit('edit')"
      >
        <Pencil class="size-4" />
        Editar
      </button>
      <button
        type="button"
        class="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-rose-600 text-sm font-semibold text-white hover:bg-rose-500"
        aria-label="Remover investimento"
        @click="emit('delete')"
      >
        <Trash2 class="size-4" />
        Excluir
      </button>
    </footer>
  </article>
</template>
