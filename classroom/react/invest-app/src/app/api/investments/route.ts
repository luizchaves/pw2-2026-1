import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { investmentSchema } from '@/schemas/investment';
import { getInvestments, saveInvestment } from '@/service/investments-repository';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const investments = await getInvestments(user.id);
    return NextResponse.json(investments);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar os investimentos',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const investment = investmentSchema.parse(await request.json());
    const savedInvestment = await saveInvestment(investment, user.id);

    return NextResponse.json(savedInvestment);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Não foi possível salvar o investimento',
      },
      { status: 400 },
    );
  }
}
