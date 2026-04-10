import { z } from "zod";

const userValidationSchema = z.object({
  body: z.object({
    fullName: z.string({
      required_error: "Full name is required",
    }).min(2, "Full name must be at least 2 characters"),
    email: z.string({
      required_error: "Email is required",
    }).email("Invalid email address"),
    password: z.string({
      required_error: "Password is required",
    }).min(6, "Password must be at least 6 characters"),
    role: z.enum(["user", "admin"]).optional().default("user"),
  }),
});

export const userValidation = {
  userValidationSchema,
};
