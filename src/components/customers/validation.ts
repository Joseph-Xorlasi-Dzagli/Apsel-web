import { z } from "zod";
import { isValidEmail } from "@/components/business/setup/utils";

// Form validation schema for customer data
export const customerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .refine(isValidEmail, { message: "Invalid email address" }),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["active", "inactive", "pending"]),
  notes: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
