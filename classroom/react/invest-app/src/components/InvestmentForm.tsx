'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  investmentFormSchema,
  toCents,
  type Investment,
  type InvestmentFormData,
  type InvestmentType,
} from '@/schemas/investment';
import Modal from '@/components/ui/Modal';

type Props = {
  investment?: Investment;
  investmentTypes: InvestmentType[];
  onSubmit: (investment: Investment) => void;
  onClose: () => void;
};

const categoryLabels: Record<string, string> = {
  'Fixed Income': 'Renda Fixa',
  'Variable Income': 'Renda Variável',
};

const todayISO = new Date().toISOString().split('T')[0];

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200';
const labelClass =
  'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';
const errorClass = 'mt-1 text-xs text-red-500';

const formatCents = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function InvestmentForm({
  investment,
  investmentTypes,
  onSubmit,
  onClose,
}: Props) {
  const defaultType = investmentTypes[0];
  const [amountDisplay, setAmountDisplay] = useState(
    investment ? formatCents(investment.amount) : '',
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: investment
      ? {
          name: investment.name,
          typeId: investment.typeId,
          broker: investment.broker,
          amountCents: investment.amount,
          yield: investment.yield ?? '',
          investedDate: investment.investedDate,
          dueDate: investment.dueDate ?? '',
        }
      : {
          typeId: defaultType?.id ?? '',
          investedDate: todayISO,
        },
  });

  const typeId = useWatch({ control, name: 'typeId' });
  const selectedType =
    investmentTypes.find((t) => t.id === typeId) ?? defaultType;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    const cents = parseInt(digits || '0', 10);
    setValue('amountCents', cents, { shouldValidate: true });
    setAmountDisplay(
      (cents / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
  };

  const onFormSubmit = (data: InvestmentFormData) => {
    if (!selectedType) return;

    onSubmit({
      id: investment?.id ?? crypto.randomUUID(),
      name: data.name,
      typeId: data.typeId,
      broker: data.broker,
      amount: toCents(data.amountCents),
      yield: data.yield || undefined,
      category: selectedType.category,
      investedDate: data.investedDate,
      dueDate: data.dueDate || null,
    });
  };

  return (
    <Modal
      title={investment ? 'Editar investimento' : 'Novo investimento'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label className={labelClass}>Nome</label>
          <input
            {...register('name')}
            placeholder="Ex: Tesouro IPCA+ 2045"
            className={inputClass}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tipo</label>
            <select {...register('typeId')} className={inputClass}>
              {investmentTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.typeId && (
              <p className={errorClass}>{errors.typeId.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Categoria</label>
            <input
              value={selectedType ? categoryLabels[selectedType.category] : ''}
              readOnly
              className="w-full rounded-xl border border-slate-100 bg-slate-100 px-3 py-2 text-sm text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Corretora</label>
            <input
              {...register('broker')}
              placeholder="Ex: XP Investimentos"
              className={inputClass}
            />
            {errors.broker && (
              <p className={errorClass}>{errors.broker.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Valor (R$)</label>
            <input
              value={amountDisplay}
              onChange={handleAmountChange}
              inputMode="numeric"
              placeholder="0,00"
              className={inputClass}
            />
            {errors.amountCents && (
              <p className={errorClass}>{errors.amountCents.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Rendimento{' '}
            <span className="font-normal normal-case text-slate-400">
              (opcional — ex: IPCA + 5%, 110% CDI, 100% Selic, 15%)
            </span>
          </label>
          <input
            {...register('yield')}
            placeholder="Ex: 100% Selic"
            className={inputClass}
          />
          {errors.yield && <p className={errorClass}>{errors.yield.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Data de aporte</label>
            <input
              {...register('investedDate')}
              type="date"
              className={inputClass}
            />
            {errors.investedDate && (
              <p className={errorClass}>{errors.investedDate.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Vencimento{' '}
              <span className="font-normal normal-case text-slate-400">
                (opcional)
              </span>
            </label>
            <input
              {...register('dueDate')}
              type="date"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!selectedType}
            className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
          >
            {investment ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
