import { z } from 'zod';

export const connexionSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(6, 'Au moins 6 caractères')
    .max(72, 'Au maximum 72 caractères'),
  role: z.enum(['sportif', 'pro']),
});

export type ConnexionInput = z.infer<typeof connexionSchema>;
