import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email(),
    password: z.string()
            .min(6, "Password must be atleast 6 characters")
            .regex(/^(?=.*[A-Z])(?=.*\d).+$/, "Password must contain uppercase letters and numbers"),
})