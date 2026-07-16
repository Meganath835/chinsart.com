import { z } from "zod";

// No .default() here — React Hook Form's defaultValues owns the defaults.
// Zod owns validation only.
export const artworkSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  price: z.number().positive().optional().nullable(),
  status: z.enum(["AVAILABLE", "SOLD", "PRICE_ON_REQUEST", "COMMISSION_OPEN"]),
  medium: z.string().max(100).optional(),
  dimensions: z.string().max(100).optional(),
  year: z.number().int().min(1800).max(new Date().getFullYear()).optional().nullable(),
  featured: z.boolean(),
  tags: z.array(z.string()),
  categoryId: z.string().optional().nullable(),
});

export type ArtworkFormData = z.infer<typeof artworkSchema>;
