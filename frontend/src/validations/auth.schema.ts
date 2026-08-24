import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),

  password: z.string().min(6, "Password must contain at least 6 characters."),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().max(100),

    email: z.string().trim().email("Enter a valid email address."),

    password: z.string().min(6, "Password must contain at least 6 characters."),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
