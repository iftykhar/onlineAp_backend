import { model, Schema } from "mongoose";
import { ISubmission } from "./submission.interface";

const answerSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    answer: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const submissionSchema = new Schema<ISubmission>(
  {
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [answerSchema],
    submittedAt: { type: Date, default: Date.now },
    isTimeout: { type: Boolean, default: false },
    tabSwitchCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["submitted", "graded"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent duplicate submissions — one submission per user per exam
submissionSchema.index({ examId: 1, userId: 1 }, { unique: true });

export const Submission = model<ISubmission>("Submission", submissionSchema);
