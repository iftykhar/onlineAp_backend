import { model, Schema } from "mongoose";
import { ExamModel, IExam, IQuestion } from "./exam.interface";

const questionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["radio", "checkbox", "text"],
      required: true,
    },
    options: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed },
  },
  { _id: true }
);

const examSchema = new Schema<IExam>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    totalCandidates: { type: Number, required: true },
    totalSlots: { type: Number, required: true },
    questionSets: { type: Number, required: true },
    questionType: { type: String, default: "MCQ" },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true }, // minutes
    negativeMarking: { type: String, default: "No Negative Marking" },
    questions: [questionSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Generate slug from title
examSchema.pre("validate", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now().toString(36);
  }
  next();
});

examSchema.statics.isExamExistBySlug = async function (
  slug: string
): Promise<IExam | null> {
  return await Exam.findOne({ slug });
};

export const Exam = model<IExam, ExamModel>("Exam", examSchema);
