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

export const centsSchema = z
  .number()
  .int()
  .positive('Valor deve ser maior que zero')
  .brand<'Cents'>();
export type Cents = z.infer<typeof centsSchema>;
export const toCents = (n: number): Cents => n as Cents;

export const investmentSchema = z.object({
  id: z.uuid(),
  userId: z.uuid().nullable().optional(),
  name: z.string().min(1, 'Nome e obrigatorio'),
  typeId: z.string().min(1, 'Tipo e obrigatorio'),
  broker: z.string().min(1, 'Corretora e obrigatoria'),
  amount: centsSchema,
  yield: investmentYieldSchema.optional(),
  category: z.enum(['Fixed Income', 'Variable Income']),
  investedDate: z.string().min(1, 'Data de aporte e obrigatoria'),
  dueDate: z.string().nullable(),
});

export const investmentFormSchema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio'),
  typeId: z.string().min(1, 'Tipo e obrigatorio'),
  broker: z.string().min(1, 'Corretora e obrigatoria'),
  amountCents: z
    .number({ error: 'Valor e obrigatorio' })
    .int()
    .positive('Valor deve ser maior que zero'),
  yield: z
    .string()
    .refine((value) => !value || YIELD_REGEX.test(value), {
      message: 'Formatos aceitos: 15%, IPCA + 5%, 110% CDI, 100% Selic',
    })
    .optional(),
  investedDate: z.string().min(1, 'Data de aporte e obrigatoria'),
  dueDate: z.string().optional(),
});

export type Investment = z.infer<typeof investmentSchema>;
export type InvestmentType = z.infer<typeof investmentTypeSchema>;
export type InvestmentCategory = z.infer<typeof investmentSchema.shape.category>;
export type InvestmentFormData = z.infer<typeof investmentFormSchema>;
