import { NextResponse } from 'next/server';

export function withErrorHandler<Args extends unknown[]>(
  handler: (...args: Args) => Promise<NextResponse>,
): (...args: Args) => Promise<NextResponse> {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
        { status: 500 },
      );
    }
  };
}
