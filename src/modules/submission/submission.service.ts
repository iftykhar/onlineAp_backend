import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { Submission } from "./submission.model";
import { Exam } from "../exam/exam.model";
import sanitizeHtml from "sanitize-html";

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
  
  // Sanitize answers if they are strings (potential rich text)
  if (payload.answers) {
    payload.answers = payload.answers.map(ans => {
      if (typeof ans.answer === 'string') {
        return {
          ...ans,
          answer: sanitizeHtml(ans.answer, {
            allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br', 'blockquote', 'code', 'pre' ],
            allowedAttributes: {
              'a': [ 'href', 'target' ],
            },
          })
        };
      }
      return ans;
    });
  }

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

const getSubmissionById = async (id: string) => {
  const result = await Submission.findById(id)
    .populate("userId", "fullName email")
    .populate("examId");
  return result;
};

const submissionService = {
  submitExam,
  getSubmissionsByExam,
  getMySubmission,
  getMyAttempts,
  getSubmissionById,
};

export default submissionService;
