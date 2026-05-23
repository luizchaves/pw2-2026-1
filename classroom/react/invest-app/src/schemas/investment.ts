import { z } from 'zod';

const YIELD_REGEX =
  /^\d+(\.\d+)?%$|^IPCA \+ \d+(\.\d+)?%$|^\d+(\.\d+)?% CDI$|^\d+(\.\d+)?% Selic$/i;

export const investmentYieldSchema = z.string().regex(YIELD_REGEX, {
  message: 'Formatos aceitos: 15%, IPCA + 5%, 110% CDI, 100% Selic',
});

export const investmentTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['Fixed Income', 'Variable Income']),
});

export const investmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  broker: z.string().min(1, 'Corretora é obrigatória'),
  amount: z.number().int().positive('Valor deve ser maior que zero'),
  yield: investmentYieldSchema.optional(),
  category: z.enum(['Fixed Income', 'Variable Income']),
  investedDate: z.string().min(1, 'Data de aporte é obrigatória'),
  dueDate: z.string().nullable(),
});

export const investmentFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  typeId: z.string().min(1, 'Tipo é obrigatório'),
  broker: z.string().min(1, 'Corretora é obrigatória'),
  amountCents: z
    .number({ error: 'Valor é obrigatório' })
    .int()
    .positive('Valor deve ser maior que zero'),
  yield: z
    .string()
    .refine((v) => !v || YIELD_REGEX.test(v), {
      message: 'Formatos aceitos: 15%, IPCA + 5%, 110% CDI, 100% Selic',
    })
    .optional(),
  investedDate: z.string().min(1, 'Data de aporte é obrigatória'),
  dueDate: z.string().optional(),
});

export type Investment = z.infer<typeof investmentSchema>;
export type InvestmentType = z.infer<typeof investmentTypeSchema>;
export type InvestmentCategory = z.infer<
  typeof investmentSchema.shape.category
>;
export type InvestmentYield = z.infer<typeof investmentYieldSchema>;
export type InvestmentFormData = z.infer<typeof investmentFormSchema>;
