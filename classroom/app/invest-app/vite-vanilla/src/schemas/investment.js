import { z } from 'zod'

const yieldRegex = /^\d+(\.\d+)?%$|^IPCA \+ \d+(\.\d+)?%$|^\d+(\.\d+)?% CDI$|^\d+(\.\d+)?% Selic$/i

export const investmentSchema = z.object({
  id: z.uuid(),
  userId: z.uuid().nullable().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  typeId: z.string().min(1, 'Tipo é obrigatório'),
  broker: z.string().min(1, 'Corretora é obrigatória'),
  amount: z.number().int().positive('Valor deve ser maior que zero'),
  yield: z
    .string()
    .refine((value) => !value || yieldRegex.test(value), {
      message: 'Formatos aceitos: 15%, IPCA + 5%, 110% CDI, 100% Selic',
    })
    .optional(),
  category: z.enum(['Fixed Income', 'Variable Income']),
  investedDate: z.string().min(1, 'Data de aporte é obrigatória'),
  dueDate: z.string().nullable(),
})

export const investmentFormSchema = investmentSchema
  .pick({
    name: true,
    typeId: true,
    broker: true,
    amount: true,
    yield: true,
    investedDate: true,
    dueDate: true,
  })
  .extend({
    dueDate: z.string().optional(),
  })
