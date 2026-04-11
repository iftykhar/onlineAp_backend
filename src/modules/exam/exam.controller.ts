import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import examService from "./exam.service";

const createExam = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await examService.createExam(req.body, userId);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Exam created successfully",
    data: result,
  });
});

const getAllExams = catchAsync(async (_req, res) => {
  const result = await examService.getAllExams();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Exams retrieved successfully",
    data: result,
  });
});

const getAvailableExams = catchAsync(async (_req, res) => {
  const result = await examService.getAvailableExams();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Available exams retrieved successfully",
    data: result,
  });
});

const getExamById = catchAsync(async (req, res) => {
  const result = await examService.getExamById(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Exam retrieved successfully",
    data: result,
  });
});

const getExamBySlug = catchAsync(async (req, res) => {
  const result = await examService.getExamBySlug(req.params.slug);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Exam retrieved successfully",
    data: result,
  });
});

const getExamBySlugForCandidate = catchAsync(async (req, res) => {
  const result = await examService.getExamBySlugForCandidate(req.params.slug);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Exam retrieved successfully",
    data: result,
  });
});

const updateExam = catchAsync(async (req, res) => {
  const result = await examService.updateExam(req.params.id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Exam updated successfully",
    data: result,
  });
});

const deleteExam = catchAsync(async (req, res) => {
  await examService.deleteExam(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Exam deleted successfully",
  });
});

// --- Question Management ---

const addQuestion = catchAsync(async (req, res) => {
  const result = await examService.addQuestion(req.params.id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Question added successfully",
    data: result,
  });
});

const updateQuestion = catchAsync(async (req, res) => {
  const result = await examService.updateQuestion(
    req.params.id,
    req.params.questionId,
    req.body
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Question updated successfully",
    data: result,
  });
});

const deleteQuestion = catchAsync(async (req, res) => {
  const result = await examService.deleteQuestion(
    req.params.id,
    req.params.questionId
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Question deleted successfully",
    data: result,
  });
});

const publishExam = catchAsync(async (req, res) => {
  const result = await examService.publishExam(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Exam published successfully",
    data: result,
  });
});

const examController = {
  createExam,
  getAllExams,
  getAvailableExams,
  getExamById,
  getExamBySlug,
  getExamBySlugForCandidate,
  updateExam,
  deleteExam,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  publishExam,
};

export default examController;
