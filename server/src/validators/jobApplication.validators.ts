import { z } from "zod";

export const createJobApplicationSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters"),
  jobUrl: z.string().url("Job URL must be a valid URL"),
  applicationDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    "Application date must be a valid date"
  ),
  status: z
    .enum(["applied", "rejected", "accepted", "pending", "interview"])
    .default("applied"),
});

export type CreateJobApplicationInput = z.infer<
  typeof createJobApplicationSchema
>;
