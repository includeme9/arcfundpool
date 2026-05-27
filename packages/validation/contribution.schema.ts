import { z } from "zod";

export const contributionSchema = z.object({
  amount: z.coerce.number().positive("Enter a USDC amount greater than zero")
});

export type ContributionInput = z.infer<typeof contributionSchema>;
