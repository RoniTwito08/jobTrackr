import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email("Email must be a valid Email adress"),

  userName: z
    .string()
    .trim()
    .min(2, "User name must be at least 2 characters long"),

  password: z.string().min(8, "password must be at least 8 characters long"),
});
export const loginSchema = z.object({
  email: z.string().trim().email("Email must be a valid Email adress"),
  password: z.string().min(8, "password must have at least 8 characters long"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
