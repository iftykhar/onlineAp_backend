import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import submissionService from "./submission.service";

const submitExam = catchAsync(async (req, res) => {
  const { examId } = req.params;
  const userId = req.user.id;
  const result = await submissionService.submitExam(examId, userId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Exam submitted successfully",
    data: result,
  });
});

const getSubmissionsByExam = catchAsync(async (req, res) => {
  const { examId } = req.params;
  const result = await submissionService.getSubmissionsByExam(examId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Submissions retrieved successfully",
    data: result,
  });
});

const getMySubmission = catchAsync(async (req, res) => {
  const { examId } = req.params;
  const userId = (req as any).user.id;
  const result = await submissionService.getMySubmission(examId, userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result ? "Submission found" : "No submission found",
    data: result,
  });
});

const getMyAttempts = catchAsync(async (req, res) => {
  const { examId } = req.params;
  const userId = (req as any).user.id;
  const result = await submissionService.getMyAttempts(examId, userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Attempt history retrieved",
    data: result,
  });
});

const submissionController = {
  submitExam,
  getSubmissionsByExam,
  getMySubmission,
  getMyAttempts,
};

export default submissionController;
