import { CalendarDays, Landmark, Pencil, Trash2, TrendingUp } from 'lucide-react';
import type { ComponentType } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Investment } from '@/schemas/investment';

type InvestmentCardProps = {
  investment: Investment;
  showValues: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

const categoryTheme: Record<Investment['category'], string> = {
  'Fixed Income': 'border-sky-200 bg-sky-50 text-sky-700',
  'Variable Income': 'border-amber-200 bg-amber-50 text-amber-700',
};

const categoryLabel: Record<Investment['category'], string> = {
  'Fixed Income': 'Renda Fixa',
  'Variable Income': 'Renda Variável',
};

type DetailItemProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default function InvestmentCard({
  investment,
  showValues,
  onEdit,
  onDelete,
}: InvestmentCardProps) {
  const yieldText = investment.yield ?? 'Não informado';
  const amountText = showValues ? formatCurrency(investment.amount / 100) : '••••••••';

  return (
    <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="gap-3 px-0">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <CardTitle>
            <h2 className="truncate text-base font-semibold leading-snug text-slate-950 sm:text-lg">
              {investment.name}
            </h2>
          </CardTitle>
          <Badge
            variant="outline"
            className={`h-6 shrink-0 rounded-md px-2.5 text-xs font-semibold ${categoryTheme[investment.category]}`}
          >
            {categoryLabel[investment.category]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-0">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <p className="text-xs font-medium text-slate-500">Valor investido</p>
          <p className="mt-0.5 text-xl font-bold leading-tight text-slate-950">{amountText}</p>
        </div>

        <div className="grid gap-2">
          <DetailItem icon={TrendingUp} label="Rentabilidade" value={yieldText} />
          <DetailItem icon={Landmark} label="Corretora" value={investment.broker} />
          <div className="grid gap-2 sm:grid-cols-2">
            <DetailItem
              icon={CalendarDays}
              label="Aporte"
              value={formatDate(investment.investedDate)}
            />
            <DetailItem
              icon={CalendarDays}
              label="Vencimento"
              value={formatDate(investment.dueDate)}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-1 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white px-0 py-3">
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          aria-label="Editar investimento"
          className="h-9 rounded-lg border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Pencil className="size-4" />
          Editar
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          aria-label="Remover investimento"
          className="h-9 rounded-lg text-sm font-semibold"
        >
          <Trash2 className="size-4" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}
