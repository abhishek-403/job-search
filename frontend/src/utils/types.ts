import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export const signUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  designation: z.string().optional(),
  experienceYears: z.coerce
    .number()
    .int()
    .min(0, "Experience must be a positive number"),
  linkedIn: z.string().optional(),
  github: z.string().optional(),
  // profileImage: z.string().url("Invalid image URL").optional(),
  resumeUrl: z.string().optional(),
  skills: z.array(z.string()).optional(),
  profileImage: z.string().optional(),
});

export const resumeSchema = z
  .instanceof(File)
  .refine((file) => file.type === "application/pdf", {
    message: "Only PDF files are allowed",
  })
  .refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "File must be less than 2MB",
  })
  .optional();
