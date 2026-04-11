import { Model, Types } from "mongoose";

export interface IQuestion {
  _id?: Types.ObjectId;
  title: string;
  type: "radio" | "checkbox" | "text";
  options?: string[];
  correctAnswer?: string | string[];
}

export interface IExam {
  _id?: string;
  title: string;
  slug: string;
  totalCandidates: number;
  totalSlots: number;
  questionSets: number;
  questionType: string; // informational only — individual questions can be any type
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  negativeMarking?: string; // e.g. "-0.25/wrong" or "No Negative Marking"
  questions: IQuestion[];
  createdBy: Types.ObjectId;
  status: "draft" | "published";
}

export interface ExamModel extends Model<IExam> {
  isExamExistBySlug(slug: string): Promise<IExam | null>;
}
