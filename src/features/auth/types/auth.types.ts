import { z } from "zod";

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\d+$/, "Phone number must only contain digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormType = z.infer<typeof loginSchema>;
