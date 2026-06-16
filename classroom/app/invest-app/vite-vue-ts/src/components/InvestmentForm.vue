<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import Modal from '@/components/Modal.vue';
import {
  type Investment,
  type InvestmentFormData,
  type InvestmentType,
  investmentFormSchema,
  toCents,
} from '@/schemas/investment';

const props = defineProps<{
  investment?: Investment;
  investmentTypes: InvestmentType[];
}>();

const emit = defineEmits<{
  submit: [investment: Investment];
  close: [];
}>();

const categoryLabels: Record<Investment['category'], string> = {
  'Fixed Income': 'Renda Fixa',
  'Variable Income': 'Renda Variavel',
};

const todayISO = new Date().toISOString().split('T')[0];

const formatCents = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const defaultType = computed(() => props.investmentTypes[0]);
const form = reactive<InvestmentFormData>({
  name: props.investment?.name ?? '',
  typeId: props.investment?.typeId ?? defaultType.value?.id ?? '',
  broker: props.investment?.broker ?? '',
  amountCents: props.investment?.amount ?? 0,
  yield: props.investment?.yield ?? '',
  investedDate: props.investment?.investedDate ?? todayISO,
  dueDate: props.investment?.dueDate ?? '',
});
const amountDisplay = ref(props.investment ? formatCents(props.investment.amount) : '');
const errors = reactive<Record<keyof InvestmentFormData, string | null>>({
  name: null,
  typeId: null,
  broker: null,
  amountCents: null,
  yield: null,
  investedDate: null,
  dueDate: null,
});

const selectedType = computed(
  () => props.investmentTypes.find((type) => type.id === form.typeId) ?? defaultType.value,
);

watch(defaultType, (type) => {
  if (!form.typeId && type) {
    form.typeId = type.id;
  }
});

const clearErrors = () => {
  for (const key of Object.keys(errors) as Array<keyof InvestmentFormData>) {
    errors[key] = null;
  }
};

const handleAmountInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '');
  const cents = Number.parseInt(digits || '0', 10);
  form.amountCents = cents;
  amountDisplay.value = formatCents(cents);
};

const handleSubmit = () => {
  clearErrors();
  const parsed = investmentFormSchema.safeParse({ ...form });

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof InvestmentFormData | undefined;
      if (field && field in errors) {
        errors[field] = issue.message;
      }
    }
    return;
  }

  if (!selectedType.value) return;

  emit('submit', {
    id: props.investment?.id ?? crypto.randomUUID(),
    name: parsed.data.name,
    typeId: parsed.data.typeId,
    broker: parsed.data.broker,
    amount: toCents(parsed.data.amountCents),
    yield: parsed.data.yield || undefined,
    category: selectedType.value.category,
    investedDate: parsed.data.investedDate,
    dueDate: parsed.data.dueDate || null,
  });
};
</script>

<template>
  <Modal :title="investment ? 'Editar investimento' : 'Novo investimento'" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label for="investment-name" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Nome
        </label>
        <input
          id="investment-name"
          v-model="form.name"
          class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none"
          placeholder="Ex: Tesouro IPCA+ 2045"
          :aria-invalid="Boolean(errors.name)"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="investment-type" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tipo
          </label>
          <select
            id="investment-type"
            v-model="form.typeId"
            class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none"
            :aria-invalid="Boolean(errors.typeId)"
          >
            <option v-for="type in investmentTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
          <p v-if="errors.typeId" class="mt-1 text-xs text-red-500">{{ errors.typeId }}</p>
        </div>

        <div>
          <label for="investment-category" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Categoria
          </label>
          <input
            id="investment-category"
            :value="selectedType ? categoryLabels[selectedType.category] : ''"
            readonly
            class="h-10 w-full rounded-lg border border-slate-100 bg-slate-100 px-3 text-sm text-slate-500"
          />
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="investment-broker" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Corretora
          </label>
          <input
            id="investment-broker"
            v-model="form.broker"
            class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none"
            placeholder="Ex: XP Investimentos"
            :aria-invalid="Boolean(errors.broker)"
          />
          <p v-if="errors.broker" class="mt-1 text-xs text-red-500">{{ errors.broker }}</p>
        </div>

        <div>
          <label for="investment-amount" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Valor (R$)
          </label>
          <input
            id="investment-amount"
            :value="amountDisplay"
            inputmode="numeric"
            class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none"
            placeholder="0,00"
            :aria-invalid="Boolean(errors.amountCents)"
            @input="handleAmountInput"
          />
          <p v-if="errors.amountCents" class="mt-1 text-xs text-red-500">{{ errors.amountCents }}</p>
        </div>
      </div>

      <div>
        <label for="investment-yield" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Rendimento
          <span class="font-normal normal-case text-slate-400">(opcional - ex: IPCA + 5%, 110% CDI, 100% Selic, 15%)</span>
        </label>
        <input
          id="investment-yield"
          v-model="form.yield"
          class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none"
          placeholder="Ex: 100% Selic"
          :aria-invalid="Boolean(errors.yield)"
        />
        <p v-if="errors.yield" class="mt-1 text-xs text-red-500">{{ errors.yield }}</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="investment-invested-date" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Data de aporte
          </label>
          <input
            id="investment-invested-date"
            v-model="form.investedDate"
            type="date"
            class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none"
            :aria-invalid="Boolean(errors.investedDate)"
          />
          <p v-if="errors.investedDate" class="mt-1 text-xs text-red-500">{{ errors.investedDate }}</p>
        </div>

        <div>
          <label for="investment-due-date" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Vencimento <span class="font-normal normal-case text-slate-400">(opcional)</span>
          </label>
          <input
            id="investment-due-date"
            v-model="form.dueDate"
            type="date"
            class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none"
          />
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button
          type="button"
          class="h-10 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:border-slate-400"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="!selectedType"
          class="h-10 rounded-full bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:bg-slate-300"
        >
          {{ investment ? 'Salvar' : 'Cadastrar' }}
        </button>
      </div>
    </form>
  </Modal>
</template>
