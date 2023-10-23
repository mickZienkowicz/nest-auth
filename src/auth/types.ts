import { z } from 'zod';

export const RegisterRequestSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

export const AuthenticateRequestSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

export const ConfirmEmailRequestSchema = z.object({
  username: z.string().email(),
  code: z
    .string()
    .length(6, { message: 'String must be exactly 6 digits' })
    .refine((value) => /^[0-9]{6}$/.test(value), {
      message: 'String must only contain digits',
    }),
});

export const ProfileRequestSchema = z.object({
  username: z.string().email(),
});

export type RegisterRequestBody = z.infer<typeof RegisterRequestSchema>;
export type AuthenticateRequestBody = z.infer<typeof AuthenticateRequestSchema>;
export type ConfirmEmailRequestBody = z.infer<typeof ConfirmEmailRequestSchema>;
export type ProfileRequestBody = z.infer<typeof ProfileRequestSchema>;
