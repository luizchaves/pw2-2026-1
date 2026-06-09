import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/auth';
import { deleteInvestment } from '@/service/investments-repository';

const paramsSchema = z.object({
  id: z.uuid(),
});

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { id } = paramsSchema.parse(await context.params);
    await deleteInvestment(id, user.id);

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
