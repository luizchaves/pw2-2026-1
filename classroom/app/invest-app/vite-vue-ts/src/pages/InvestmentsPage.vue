<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import InvestmentCard from '@/components/InvestmentCard.vue';
import InvestmentForm from '@/components/InvestmentForm.vue';
import Modal from '@/components/Modal.vue';
import { useInvestmentActions } from '@/composables/useInvestmentActions';
import { useInvestments } from '@/composables/useInvestments';
import { useVisibilityStore } from '@/stores/visibility';

const visibility = useVisibilityStore();
const { investments, investmentTypes, isLoading, error } = useInvestments();
const {
  showForm,
  actionError,
  editingInvestment,
  deletingInvestment,
  openCreateForm,
  handleEdit,
  closeForm,
  handleFormSubmit,
  handleDeleteConfirm,
} = useInvestmentActions();

const skeletonIds = ['investment-skeleton-1', 'investment-skeleton-2', 'investment-skeleton-3'];
</script>

<template>
  <section class="mx-auto mt-6 max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Portfolio</p>
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-900">Meus investimentos</h1>
        <p class="max-w-2xl text-sm text-slate-600">
          Uma visao rapida dos seus principais ativos, com retorno, valor investido e datas
          importantes.
        </p>
      </div>
      <button
        id="open-investment-form"
        type="button"
        class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 sm:w-auto"
        @click="openCreateForm"
      >
        <Plus class="h-4 w-4" />
        Cadastrar investimento
      </button>
    </div>

    <div
      v-if="error || actionError"
      class="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
    >
      {{ error ?? actionError }}
    </div>

    <div
      v-if="isLoading"
      role="status"
      aria-label="Carregando investimentos"
      class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      <article
        v-for="skeletonId in skeletonIds"
        :key="skeletonId"
        class="animate-pulse rounded-lg border border-slate-200 bg-white p-6"
      >
        <div class="h-6 w-3/4 rounded-full bg-slate-200" />
        <div class="mt-4 flex gap-3">
          <div class="h-6 w-24 rounded-full bg-slate-200" />
          <div class="h-6 w-16 rounded-full bg-slate-200" />
        </div>
        <div class="mt-6 h-20 rounded-lg bg-slate-100" />
        <div class="mt-4 grid grid-cols-2 gap-3">
          <div class="col-span-2 h-16 rounded-lg bg-slate-100" />
          <div class="h-16 rounded-lg bg-slate-100" />
          <div class="h-16 rounded-lg bg-slate-100" />
        </div>
      </article>
    </div>

    <article
      v-else-if="investments.length === 0"
      class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-16 text-center"
    >
      <p class="text-lg font-semibold text-slate-700">Nenhum investimento cadastrado</p>
      <p class="mt-2 text-sm text-slate-500">
        Clique em "Cadastrar investimento" para adicionar o seu primeiro ativo.
      </p>
    </article>

    <div v-else id="investment-grid" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <InvestmentCard
        v-for="investment in investments"
        :key="investment.id"
        :investment="investment"
        :show-values="visibility.showValues"
        @edit="handleEdit(investment)"
        @delete="deletingInvestment = investment"
      />
    </div>

    <InvestmentForm
      v-if="showForm"
      :investment="editingInvestment ?? undefined"
      :investment-types="investmentTypes"
      @submit="handleFormSubmit"
      @close="closeForm"
    />

    <Modal v-if="deletingInvestment" title="Remover investimento" @close="deletingInvestment = null">
      <p class="text-slate-600">
        Tem certeza que deseja remover
        <strong class="font-semibold text-slate-900">{{ deletingInvestment.name }}</strong>?
        Essa acao nao pode ser desfeita.
      </p>
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="h-10 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:border-slate-400"
          @click="deletingInvestment = null"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="h-10 rounded-full bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500"
          @click="handleDeleteConfirm"
        >
          Remover
        </button>
      </div>
    </Modal>
  </section>
</template>
