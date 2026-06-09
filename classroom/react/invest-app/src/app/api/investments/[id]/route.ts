import { NextResponse } from 'next/server';
import { z } from 'zod';
import { deleteInvestment } from '@/service/investments-repository';

const paramsSchema = z.object({
  id: z.uuid(),
});

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = paramsSchema.parse(await context.params);
    await deleteInvestment(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Não foi possível remover o investimento',
      },
      { status: 400 },
    );
  }
}
