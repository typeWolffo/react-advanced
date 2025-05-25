import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email format');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number');

export const taskTitleSchema = z
  .string()
  .min(1, 'Title is required')
  .max(200, 'Title must be less than 200 characters');

export const prioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const result = passwordSchema.safeParse(password);
  return {
    valid: result.success,
    errors: result.success ? [] : result.error.errors.map(e => e.message),
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
