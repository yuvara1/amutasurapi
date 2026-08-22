import { z } from "zod";

export const donationSchema = z.object({
  foodName: z.string().min(3, "Food name must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  quantity: z.string().min(1, "Quantity is required").refine(v => !isNaN(Number(v)) && Number(v) > 0, "Quantity must be a positive number"),
  unit: z.string().min(1, "Please select a unit"),
  description: z.string().optional(),
  dietaryTags: z.array(z.string()).optional(),
  preparedAt: z.string().optional(),
  expiresAt: z.string().min(1, "Expiry date/time is required"),
  storage: z.string().min(1, "Please select a storage requirement"),
  safetyNotes: z.string().optional(),
  address: z.string().min(5, "Pickup address is required"),
  pickupStart: z.string().min(1, "Pickup window start is required"),
  pickupEnd: z.string().min(1, "Pickup window end is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  pickupInstructions: z.string().optional(),
});

export type DonationFormData = z.infer<typeof donationSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
