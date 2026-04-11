import { Types } from "mongoose";

export interface IAnswer {
  questionId: Types.ObjectId;
  answer: string | string[];
}

export interface ISubmission {
  examId: Types.ObjectId;
  userId: Types.ObjectId;
  answers: IAnswer[];
  submittedAt: Date;
  isTimeout: boolean;
  tabSwitchCount: number;
  status: "submitted" | "graded";
}
