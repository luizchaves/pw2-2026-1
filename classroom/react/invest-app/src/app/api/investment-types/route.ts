import { NextResponse } from 'next/server';
import { getInvestmentTypes } from '@/services/supabase/investments';

export async function GET() {
  try {
    const investmentTypes = await getInvestmentTypes();
    return NextResponse.json(investmentTypes);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar os tipos de investimento',
      },
      { status: 500 },
    );
  }
}
