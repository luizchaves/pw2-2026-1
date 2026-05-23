'use client';

import { useState } from 'react';
import { investmentTypes } from '@/data/investments';
import type { Investment, InvestmentYield } from '@/types/investment';
import Modal from '@/components/ui/Modal';

type Props = {
  onSubmit: (investment: Investment) => void;
  onClose: () => void;
};

const todayISO = new Date().toISOString().split('T')[0];

const initialForm = {
  name: '',
  type: investmentTypes[0].id,
  broker: '',
  amount: '',
  yieldValue: '',
  investedDate: todayISO,
  dueDate: '',
};

export default function InvestmentForm({ onSubmit, onClose }: Props) {
  const [form, setForm] = useState(initialForm);

  const selectedType = investmentTypes.find((t) => t.id === form.type)!;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: crypto.randomUUID(),
      name: form.name,
      type: form.type,
      broker: form.broker,
      amount: Number(form.amount),
      yield: form.yieldValue ? (form.yieldValue as InvestmentYield) : undefined,
      category: selectedType.category,
      investedDate: form.investedDate,
      dueDate: form.dueDate || null,
    });
  };

  return (
    <Modal title="Novo investimento" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Nome
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Ex: Tesouro Reserva"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tipo
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              {[...investmentTypes]
                .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Categoria
            </label>
            <input
              value={selectedType.category}
              readOnly
              className="w-full rounded-xl border border-slate-100 bg-slate-100 px-3 py-2 text-sm text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Corretora
            </label>
            <input
              name="broker"
              value={form.broker}
              onChange={handleChange}
              required
              placeholder="Ex: Corretora Y"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Valor (R$)
            </label>
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              required
              placeholder="0,00"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Rendimento{' '}
            <span className="font-normal normal-case text-slate-400">
              (opcional — ex: IPCA + 5%, 110% CDI, 100% Selic, 15%)
            </span>
          </label>
          <input
            name="yieldValue"
            value={form.yieldValue}
            onChange={handleChange}
            placeholder="Ex: 100% Selic"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Data de aporte
            </label>
            <input
              name="investedDate"
              type="date"
              value={form.investedDate}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Vencimento{' '}
              <span className="font-normal normal-case text-slate-400">
                (opcional)
              </span>
            </label>
            <input
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
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
            className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </Modal>
  );
}
