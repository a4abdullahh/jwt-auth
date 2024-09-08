import mongoose from 'mongoose';
import { z } from 'zod';

export const emailSchema = z.string().email();

export const passwordSchema = z.string().min(6).max(255);

const baseSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
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

export const objectIdSchema = z.custom<mongoose.Types.ObjectId>();

export const resetPasswordSchema = z.object({
  verificationCode: objectIdSchema,
  password: passwordSchema,
});
