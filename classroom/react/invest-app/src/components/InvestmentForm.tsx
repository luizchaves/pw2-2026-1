'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/Modal';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import {
  type Investment,
  type InvestmentFormData,
  type InvestmentType,
  investmentFormSchema,
  toCents,
} from '@/schemas/investment';

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

const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';
const errorClass = 'mt-1 text-xs text-red-500';
const inputClass =
  'h-10 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-sky-200';

const formatCents = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function InvestmentForm({ investment, investmentTypes, onSubmit, onClose }: Props) {
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
  const selectedType = investmentTypes.find((t) => t.id === typeId) ?? defaultType;

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
    <Modal title={investment ? 'Editar investimento' : 'Novo investimento'} onClose={onClose}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="investment-name" className={labelClass}>
            Nome
          </Label>
          <Input
            id="investment-name"
            {...register('name')}
            placeholder="Ex: Tesouro IPCA+ 2045"
            aria-invalid={Boolean(errors.name)}
            className={inputClass}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="investment-type" className={labelClass}>
              Tipo
            </Label>
            <NativeSelect
              id="investment-type"
              {...register('typeId')}
              aria-invalid={Boolean(errors.typeId)}
              className="w-full"
            >
              {investmentTypes.map((t) => (
                <NativeSelectOption key={t.id} value={t.id}>
                  {t.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {errors.typeId && <p className={errorClass}>{errors.typeId.message}</p>}
          </div>

          <div>
            <Label htmlFor="investment-category" className={labelClass}>
              Categoria
            </Label>
            <Input
              id="investment-category"
              value={selectedType ? categoryLabels[selectedType.category] : ''}
              readOnly
              className="h-10 rounded-xl border-slate-100 bg-slate-100 text-sm text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="investment-broker" className={labelClass}>
              Corretora
            </Label>
            <Input
              id="investment-broker"
              {...register('broker')}
              placeholder="Ex: XP Investimentos"
              aria-invalid={Boolean(errors.broker)}
              className={inputClass}
            />
            {errors.broker && <p className={errorClass}>{errors.broker.message}</p>}
          </div>

          <div>
            <Label htmlFor="investment-amount" className={labelClass}>
              Valor (R$)
            </Label>
            <Input
              id="investment-amount"
              value={amountDisplay}
              onChange={handleAmountChange}
              inputMode="numeric"
              placeholder="0,00"
              aria-invalid={Boolean(errors.amountCents)}
              className={inputClass}
            />
            {errors.amountCents && <p className={errorClass}>{errors.amountCents.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="investment-yield" className={labelClass}>
            Rendimento{' '}
            <span className="font-normal normal-case text-slate-400">
              (opcional — ex: IPCA + 5%, 110% CDI, 100% Selic, 15%)
            </span>
          </Label>
          <Input
            id="investment-yield"
            {...register('yield')}
            placeholder="Ex: 100% Selic"
            aria-invalid={Boolean(errors.yield)}
            className={inputClass}
          />
          {errors.yield && <p className={errorClass}>{errors.yield.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="investment-invested-date" className={labelClass}>
              Data de aporte
            </Label>
            <Input
              id="investment-invested-date"
              {...register('investedDate')}
              type="date"
              aria-invalid={Boolean(errors.investedDate)}
              className={inputClass}
            />
            {errors.investedDate && <p className={errorClass}>{errors.investedDate.message}</p>}
          </div>

          <div>
            <Label htmlFor="investment-due-date" className={labelClass}>
              Vencimento <span className="font-normal normal-case text-slate-400">(opcional)</span>
            </Label>
            <Input
              id="investment-due-date"
              {...register('dueDate')}
              type="date"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 rounded-full border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:border-slate-400"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!selectedType}
            className="h-10 rounded-full bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500"
          >
            {investment ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
