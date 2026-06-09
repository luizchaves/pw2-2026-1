import { NextResponse } from 'next/server';
import { investmentSchema } from '@/schemas/investment';
import { getInvestments, saveInvestment } from '@/server/investments';

export async function GET() {
  try {
    const investments = await getInvestments();
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
    const investment = investmentSchema.parse(await request.json());
    const savedInvestment = await saveInvestment(investment);

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
