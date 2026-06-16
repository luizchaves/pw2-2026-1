import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api-handler';
import { investmentSchema } from '@/schemas/investment';
import { getAuthenticatedUser, getBearerToken } from '@/services/supabase/auth';
import { getInvestments, saveInvestment } from '@/services/supabase/investments';

export const GET = withErrorHandler(async (request: Request) => {
  const accessToken = getBearerToken(request);
  const user = await getAuthenticatedUser(request);
  if (!user || !accessToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const investments = await getInvestments(user.id, accessToken);
  return NextResponse.json(investments);
});

export const POST = withErrorHandler(async (request: Request) => {
  const accessToken = getBearerToken(request);
  const user = await getAuthenticatedUser(request);
  if (!user || !accessToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const parsed = investmentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const savedInvestment = await saveInvestment(parsed.data, user.id, accessToken);
  return NextResponse.json(savedInvestment);
});
