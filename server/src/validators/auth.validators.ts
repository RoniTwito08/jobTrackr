import { z } from "zod";

// Helper function to check for sequential numbers
function hasSequentialNumbers(str: string): boolean {
  // Check for 4+ consecutive ascending digits (e.g., 1234, 4567, 5678, 123456, etc.)
  const digits = str.replace(/\D/g, ""); // Extract only digits
  for (let i = 0; i < digits.length - 3; i++) {
    const current = parseInt(digits[i]);
    const next1 = parseInt(digits[i + 1]);
    const next2 = parseInt(digits[i + 2]);
    const next3 = parseInt(digits[i + 3]);
    
    // Check if 4 consecutive digits are ascending by 1
    if (next1 === current + 1 && next2 === current + 2 && next3 === current + 3) {
      return true;
    }
  }
  return false;
}

export const registerSchema = z.object({
  email: z.string().trim().email("Email must be a valid Email adress"),

  firstName: z
    .string()
    .trim()
    .min(1, "First name is required"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((pwd) => /[A-Z]/.test(pwd), "Password must contain at least 1 uppercase letter")
    .refine((pwd) => /\d/.test(pwd), "Password must contain at least 1 number")
    .refine((pwd) => !hasSequentialNumbers(pwd), "Password cannot contain sequential numbers like 1234, 5678, etc."),
});
export const loginSchema = z.object({
  email: z.string().trim().email("Email must be a valid Email adress"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
