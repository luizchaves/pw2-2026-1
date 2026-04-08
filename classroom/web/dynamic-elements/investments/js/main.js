import { investments } from './data.js';
import { formatCurrency, formatDate } from './utils/format.js';

function generateInvestmentRow(investment) {
  return `<tr class="hover:bg-surface-container-low/50 transition-colors group">
    <td class="px-8 py-6">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
          <span class="material-symbols-outlined text-primary"
            data-icon="account_balance">account_balance</span>
        </div>
        <div>
          <div class="font-bold text-on-surface">${investment.name}</div>
          <div class="text-xs text-on-surface-variant">${investment.description}</div>
        </div>
      </div>
    </td>
    <td class="px-6 py-6 text-right font-headline font-bold text-on-surface">${formatCurrency(investment.amount)}</td>
    <td class="px-6 py-6">
      <span
        class="text-xs font-semibold px-3 py-1 bg-surface-container-high rounded-full text-on-surface">${investment.category}</span>
    </td>
    <td class="px-6 py-6 text-sm text-on-surface-variant">${formatDate(investment.investedDate)}</td>
    <td class="px-6 py-6 text-sm text-on-surface-variant">${formatDate(investment.maturityDate)}</td>
    <td class="px-8 py-6 text-right">
      <button class="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span class="material-symbols-outlined text-outline" data-icon="more_vert">more_vert</span>
      </button>
    </td>
  </tr>`;
}

const tbody = document.querySelector('tbody');
tbody.innerHTML = investments.map(generateInvestmentRow).join('');
