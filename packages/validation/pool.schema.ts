import { z } from "zod";
import { POOL_CATEGORIES } from "@arcfundpool/config";

export const createPoolSchema = z.object({
  title: z.string().trim().min(1, "Pool title is required"),
  description: z.string().trim().min(20, "Add a clear funding description"),
  targetAmount: z.coerce.number().positive("Target amount must be greater than zero"),
  deadline: z.string().refine((value) => new Date(value).getTime() > Date.now(), "Deadline must be in the future"),
  category: z.enum(POOL_CATEGORIES),
  imageUrl: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  externalLink: z.string().url("Enter a valid external link").optional().or(z.literal(""))
});

export type CreatePoolInput = z.infer<typeof createPoolSchema>;
