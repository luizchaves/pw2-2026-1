import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { mockInvestments, mockInvestmentTypes } from '../../testing/investment-fixtures';
import { AuthService } from './auth.service';
import { InvestmentService } from './investment.service';
import { SupabaseService } from './supabase.service';
import { ToastService } from './toast.service';

const makeQuery = (response: unknown = { data: [], error: null }) => {
  const query = {
    select: vi.fn(() => query),
    order: vi.fn(() => Promise.resolve(response)),
    eq: vi.fn(() => query),
    single: vi.fn(() => Promise.resolve(response)),
    upsert: vi.fn(() => Promise.resolve(response)),
    delete: vi.fn(() => query),
  };

  return query;
};

describe('InvestmentService', () => {
  it('loads investment types and authenticated user investments', async () => {
    const typesQuery = makeQuery({ data: mockInvestmentTypes, error: null });
    const investmentsQuery = makeQuery({
      data: [
        {
          id: mockInvestments[0].id,
          userId: mockInvestments[0].userId,
          name: mockInvestments[0].name,
          type: mockInvestments[0].typeId,
          broker: mockInvestments[0].broker,
          amount: mockInvestments[0].amount,
          yield: mockInvestments[0].yield,
          category: mockInvestments[0].category,
          investedDate: mockInvestments[0].investedDate,
          dueDate: mockInvestments[0].dueDate,
        },
      ],
      error: null,
    });
    const from = vi.fn((table: string) =>
      table === 'investment_types' ? typesQuery : investmentsQuery,
    );

    TestBed.configureTestingModule({
      providers: [
        InvestmentService,
        { provide: SupabaseService, useValue: { client: { from } } },
        { provide: AuthService, useValue: { user: () => ({ id: 'user-1' }) } },
        { provide: ToastService, useValue: { show: vi.fn() } },
      ],
    });

    const service = TestBed.inject(InvestmentService);
    await service.load();

    expect(from).toHaveBeenCalledWith('investment_types');
    expect(from).toHaveBeenCalledWith('investments_with_types');
    expect(investmentsQuery.eq).toHaveBeenCalledWith('userId', 'user-1');
    expect(service.investmentTypes()).toEqual(mockInvestmentTypes);
    expect(service.investments()).toEqual([mockInvestments[0]]);
  });

  it('stores load errors', async () => {
    const failingQuery = makeQuery({ data: null, error: new Error('DB down') });
    const from = vi.fn(() => failingQuery);

    TestBed.configureTestingModule({
      providers: [
        InvestmentService,
        { provide: SupabaseService, useValue: { client: { from } } },
        { provide: AuthService, useValue: { user: () => ({ id: 'user-1' }) } },
        { provide: ToastService, useValue: { show: vi.fn() } },
      ],
    });

    const service = TestBed.inject(InvestmentService);
    await service.load();

    expect(service.error()).toBe('DB down');
  });

  it('upserts an investment for the current user', async () => {
    const upsertQuery = makeQuery({ data: null, error: null });
    const selectQuery = makeQuery({
      data: {
        id: mockInvestments[0].id,
        userId: 'user-1',
        name: mockInvestments[0].name,
        type: mockInvestments[0].typeId,
        broker: mockInvestments[0].broker,
        amount: mockInvestments[0].amount,
        yield: mockInvestments[0].yield,
        category: mockInvestments[0].category,
        investedDate: mockInvestments[0].investedDate,
        dueDate: mockInvestments[0].dueDate,
      },
      error: null,
    });
    const from = vi.fn((table: string) => (table === 'investments' ? upsertQuery : selectQuery));
    const show = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        InvestmentService,
        { provide: SupabaseService, useValue: { client: { from } } },
        { provide: AuthService, useValue: { user: () => ({ id: 'user-1' }) } },
        { provide: ToastService, useValue: { show } },
      ],
    });

    const service = TestBed.inject(InvestmentService);
    await service.save(mockInvestments[0]);

    expect(upsertQuery.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockInvestments[0].id,
        user_id: 'user-1',
        amount_cents: mockInvestments[0].amount,
      }),
    );
    expect(service.investments()).toEqual([{ ...mockInvestments[0], userId: 'user-1' }]);
    expect(show).toHaveBeenCalledWith('Investimento salvo com sucesso', 'success');
  });

  it('deletes an investment scoped to the current user', async () => {
    const deleteQuery = makeQuery({ data: null, error: null });
    const from = vi.fn(() => deleteQuery);
    const show = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        InvestmentService,
        { provide: SupabaseService, useValue: { client: { from } } },
        { provide: AuthService, useValue: { user: () => ({ id: 'user-1' }) } },
        { provide: ToastService, useValue: { show } },
      ],
    });

    const service = TestBed.inject(InvestmentService);
    service.investments.set([...mockInvestments]);
    await service.delete(mockInvestments[0].id);

    expect(deleteQuery.delete).toHaveBeenCalled();
    expect(deleteQuery.eq).toHaveBeenCalledWith('id', mockInvestments[0].id);
    expect(deleteQuery.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(service.investments()).toEqual([mockInvestments[1]]);
    expect(show).toHaveBeenCalledWith('Investimento removido com sucesso', 'success');
  });
});
