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

// Allow multiple submissions per user per exam (index without unique constraint if needed, but for now we follow the user's request for unlimited attempts)
// submissionSchema.index({ examId: 1, userId: 1 }, { unique: true });

export const Submission = model<ISubmission>("Submission", submissionSchema);
