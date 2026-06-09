export const queryKeys = {
  investments: (userId: string) => ['investments', userId] as const,
  investmentTypes: ['investment-types'] as const,
};
