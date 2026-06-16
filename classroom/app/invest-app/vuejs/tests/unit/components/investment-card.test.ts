import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import InvestmentCard from '@/components/InvestmentCard.vue';
import { mockInvestments } from '../../fixtures/investments';

describe('InvestmentCard', () => {
  it('renders investment details and emits actions', async () => {
    const wrapper = mount(InvestmentCard, {
      props: {
        investment: mockInvestments[0],
        showValues: true,
      },
    });

    expect(wrapper.text()).toContain('Tesouro IPCA+ 2045');
    expect(wrapper.text()).toContain('XP Investimentos');
    expect(wrapper.text()).toMatch(/R\$\s?1\.000,00/);

    await wrapper.get('[aria-label="Editar investimento"]').trigger('click');
    await wrapper.get('[aria-label="Remover investimento"]').trigger('click');

    expect(wrapper.emitted('edit')).toHaveLength(1);
    expect(wrapper.emitted('delete')).toHaveLength(1);
  });

  it('hides monetary values when showValues is false', () => {
    const wrapper = mount(InvestmentCard, {
      props: {
        investment: mockInvestments[0],
        showValues: false,
      },
    });

    expect(wrapper.text()).toContain('........');
  });
});
