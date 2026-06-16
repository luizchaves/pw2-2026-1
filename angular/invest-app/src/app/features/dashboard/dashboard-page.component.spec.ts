import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { InvestmentService } from '../../core/services/investment.service';
import { VisibilityService } from '../../core/services/visibility.service';
import { mockInvestments } from '../../testing/investment-fixtures';
import { DashboardPageComponent } from './dashboard-page.component';

describe('DashboardPageComponent', () => {
  const render = async (options: {
    loading?: boolean;
    investments?: unknown[];
    showValues?: boolean;
  }) => {
    const investments = signal(options.investments ?? []);
    const isLoading = signal(Boolean(options.loading));
    const showValues = signal(options.showValues ?? true);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: InvestmentService,
          useValue: {
            investments,
            isLoading,
            load: () => Promise.resolve(),
          },
        },
        { provide: VisibilityService, useValue: { showValues } },
      ],
    });

    const fixture = TestBed.createComponent(DashboardPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  };

  it('shows loading state', async () => {
    const fixture = await render({ loading: true });

    expect(fixture.nativeElement.textContent).toContain('Dashboard');
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeTruthy();
  });

  it('shows empty state', async () => {
    const fixture = await render({ investments: [] });

    expect(fixture.nativeElement.textContent).toContain('Nenhum investimento ainda');
  });

  it('shows total amount and count', async () => {
    const fixture = await render({ investments: mockInvestments });
    const text = fixture.nativeElement.textContent;

    expect(text).toMatch(/1\.500,00/);
    expect(text).toContain('2 investimentos');
  });

  it('hides values when visibility is disabled', async () => {
    const fixture = await render({ investments: mockInvestments, showValues: false });
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('••••••••');
    expect(text).not.toMatch(/1\.500,00/);
  });
});
