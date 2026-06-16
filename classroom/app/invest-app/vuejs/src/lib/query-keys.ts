export const queryKeys = {
  investmentTypes: ['investment-types'] as const,
  investments: (userId: string) => ['investments', userId] as const,
};
