import { z } from "zod";
import { POOL_CATEGORIES } from "@arcfundpool/config";

export const createPoolSchema = z.object({
  title: z.string().trim().min(1, "Add a pool title in the Details step."),
  description: z.string().trim().min(20, "Add a funding description in the Details step."),
  targetAmount: z.coerce.number().positive("Set a target amount in the Funding step."),
  deadline: z.string().refine((value) => new Date(value).getTime() > Date.now(), "Choose a future deadline in the Funding step."),
  category: z.enum(POOL_CATEGORIES),
  imageUrl: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  externalLink: z.string().url("Enter a valid external link").optional().or(z.literal(""))
});

export type CreatePoolInput = z.infer<typeof createPoolSchema>;
