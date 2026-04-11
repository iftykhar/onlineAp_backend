import { z } from "zod";

const questionSchema = z.object({
  title: z.string().min(1, "Question title is required"),
  type: z.enum(["radio", "checkbox", "text", "rich-text"]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]).optional().nullable(),
});

export const examValidation = {
  createExamSchema: z.object({
    body: z.object({
      title: z.string().min(3, "Title must be at least 3 characters"),
      totalCandidates: z.number().min(1, "Must have at least 1 candidate"),
      totalSlots: z.number().min(1, "Must have at least 1 slot"),
      questionSets: z.number().min(1, "Must have at least 1 question set"),
      questionType: z.string().optional(),
      startTime: z.string().min(1, "Start time is required"),
      endTime: z.string().min(1, "End time is required"),
      duration: z.number().min(1, "Duration must be at least 1 minute"),
      negativeMarking: z.string().optional(),
    }),
  }),

  updateExamSchema: z.object({
    body: z.object({
      title: z.string().min(3).optional(),
      totalCandidates: z.number().min(1).optional(),
      totalSlots: z.number().min(1).optional(),
      questionSets: z.number().min(1).optional(),
      questionType: z.string().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      duration: z.number().min(1).optional(),
      negativeMarking: z.string().optional(),
    }),
  }),

  addQuestionSchema: z.object({
    body: questionSchema,
  }),

  updateQuestionSchema: z.object({
    body: questionSchema.partial(),
  }),
};
