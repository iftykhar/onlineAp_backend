import { z } from "zod";

export const submissionValidation = {
  submitExamSchema: z.object({
    body: z.object({
      answers: z.array(
        z.object({
          questionId: z.string().min(1, "Question ID is required"),
          answer: z.union([z.string(), z.array(z.string())]),
        })
      ),
      isTimeout: z.boolean().optional(),
      tabSwitchCount: z.number().optional(),
    }),
  }),
};
