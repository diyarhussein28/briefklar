import { z } from "zod";

/** Calendar date without time, YYYY-MM-DD. */
export const IsoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** A deadline the user saved on this device. Never sent to a server. */
export const SavedDeadlineSchema = z.object({
  id: z.string(),
  title: z.string(),
  sender: z.string().nullable(),
  date: IsoDateSchema,
  description: z.string(),
  reference: z.string().nullable(),
  /** Already formatted for display, e.g. "123,45 €". */
  amount: z.string().nullable(),
  createdAt: z.string(),
  done: z.boolean(),
});

export type SavedDeadline = z.infer<typeof SavedDeadlineSchema>;

export type NewDeadline = Omit<SavedDeadline, "id" | "createdAt" | "done">;
