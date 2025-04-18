import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().optional(),
  designation: z.string().optional(),
  email: z.string().email().optional(),
  linkedIn: z.string().optional(),
  github: z.string().optional(),
  experienceYears: z.number().optional(),
  resumeUrl: z.string().optional(),
  skills: z.array(z.string()).optional(),
  profileImage: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
