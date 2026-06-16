import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withErrorHandler } from '@/lib/api-handler';
import { getAuthenticatedUser, getBearerToken } from '@/services/supabase/auth';
import { deleteInvestment } from '@/services/supabase/investments';

const paramsSchema = z.object({
  id: z.uuid(),
});

export const DELETE = withErrorHandler(
  async (request: Request, context: { params: Promise<{ id: string }> }) => {
    const accessToken = getBearerToken(request);
    const user = await getAuthenticatedUser(request);
    if (!user || !accessToken) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const parsed = paramsSchema.safeParse(await context.params);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    await deleteInvestment(parsed.data.id, user.id, accessToken);

    return new NextResponse(null, { status: 204 });
  },
);
