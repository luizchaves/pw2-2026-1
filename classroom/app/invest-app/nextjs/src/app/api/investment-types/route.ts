import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api-handler';
import { getInvestmentTypes } from '@/services/supabase/investments';

export const GET = withErrorHandler(async () => {
  const investmentTypes = await getInvestmentTypes();
  return NextResponse.json(investmentTypes);
});
