import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { Submission } from "./submission.model";
import { Exam } from "../exam/exam.model";

const submitExam = async (
  examId: string,
  userId: string,
  payload: {
    answers: { questionId: string; answer: string | string[] }[];
    isTimeout?: boolean;
    tabSwitchCount?: number;
  }
) => {
  // Check exam exists and is published
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new AppError("Exam not found", StatusCodes.NOT_FOUND);
  }
  if (exam.status !== "published") {
    throw new AppError("Exam is not available", StatusCodes.BAD_REQUEST);
  }

  // Check if already submitted - REMOVED to allow multiple attempts as per user request
  // const existingSubmission = await Submission.findOne({ examId, userId });
  // if (existingSubmission) {
  //   throw new AppError(
  //     "You have already submitted this exam",
  //     StatusCodes.CONFLICT
  //   );
  // }

  const result = await Submission.create({
    examId,
    userId,
    answers: payload.answers,
    isTimeout: payload.isTimeout || false,
    tabSwitchCount: payload.tabSwitchCount || 0,
    submittedAt: new Date(),
  });

  return result;
};

const getSubmissionsByExam = async (examId: string) => {
  const result = await Submission.find({ examId })
    .populate("userId", "fullName email")
    .sort({ submittedAt: -1 });
  return result;
};

const getMySubmission = async (examId: string, userId: string) => {
  // Return the latest submission
  const result = await Submission.findOne({ examId, userId }).sort({
    submittedAt: -1,
  });
  return result;
};

const getMyAttempts = async (examId: string, userId: string) => {
  const result = await Submission.find({ examId, userId }).sort({
    submittedAt: -1,
  });
  return result;
};

const submissionService = {
  submitExam,
  getSubmissionsByExam,
  getMySubmission,
  getMyAttempts,
};

export default submissionService;
