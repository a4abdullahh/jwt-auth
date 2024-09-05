import { z } from 'zod';

const baseSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
  confirmPassword: z.string().min(6).max(255),
  userAgent: z.string().optional(),
});

export const loginSchema = baseSchema.omit({ confirmPassword: true });

export const registerSchema = baseSchema.refine(
  ({ password, confirmPassword }) => password === confirmPassword,
  {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  }
);
