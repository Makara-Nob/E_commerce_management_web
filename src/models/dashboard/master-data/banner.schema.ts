import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "Image URL is required"),
  linkUrl: z.string().optional(),
  displayOrder: z.coerce.number().int().nonnegative().default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export type BannerFormData = z.infer<typeof bannerSchema>;
