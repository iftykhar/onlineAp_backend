import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { IExam, IQuestion } from "./exam.interface";
import { Exam } from "./exam.model";

const createExam = async (
  payload: Partial<IExam>,
  userId: string
) => {
  const examData = {
    ...payload,
    startTime: new Date(payload.startTime as unknown as string),
    endTime: new Date(payload.endTime as unknown as string),
    createdBy: userId,
    questions: [],
    status: "draft" as const,
  };

  const result = await Exam.create(examData);
  return result;
};

const getAllExams = async (search?: string) => {
  const query: any = {};
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }
  const result = await Exam.find(query)
    .populate("createdBy", "fullName email")
    .sort({ createdAt: -1 });
  return result;
};

const getAvailableExams = async (search?: string) => {
  const now = new Date();
  const query: any = {
    status: "published",
    startTime: { $lte: now },
    endTime: { $gte: now },
  };

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const result = await Exam.find(query)
    .select("-questions.correctAnswer") // Hide answers from candidates
    .sort({ startTime: 1 });
  return result;
};

const getExamById = async (id: string) => {
  const result = await Exam.findById(id).populate(
    "createdBy",
    "fullName email"
  );
  if (!result) {
    throw new AppError("Exam not found", StatusCodes.NOT_FOUND);
  }
  return result;
};

const getExamBySlug = async (slug: string) => {
  const result = await Exam.findOne({ slug }).populate(
    "createdBy",
    "fullName email"
  );
  if (!result) {
    throw new AppError("Exam not found", StatusCodes.NOT_FOUND);
  }
  return result;
};

const getExamBySlugForCandidate = async (slug: string) => {
  const result = await Exam.findOne({ slug, status: "published" }).select(
    "-questions.correctAnswer"
  );
  if (!result) {
    throw new AppError("Exam not found or not available", StatusCodes.NOT_FOUND);
  }
  return result;
};

const updateExam = async (id: string, payload: Partial<IExam>) => {
  const exam = await Exam.findById(id);
  if (!exam) {
    throw new AppError("Exam not found", StatusCodes.NOT_FOUND);
  }

  // Convert date strings to Date objects if present
  if (payload.startTime) {
    payload.startTime = new Date(payload.startTime as unknown as string);
  }
  if (payload.endTime) {
    payload.endTime = new Date(payload.endTime as unknown as string);
  }

  const result = await Exam.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteExam = async (id: string) => {
  const exam = await Exam.findById(id);
  if (!exam) {
    throw new AppError("Exam not found", StatusCodes.NOT_FOUND);
  }
  await Exam.findByIdAndDelete(id);
  return null;
};

// --- Question Management ---

const addQuestion = async (examId: string, question: IQuestion) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new AppError("Exam not found", StatusCodes.NOT_FOUND);
  }

  exam.questions.push(question);
  await exam.save();

  // Return the newly added question (last in array)
  return exam.questions[exam.questions.length - 1];
};

const updateQuestion = async (
  examId: string,
  questionId: string,
  data: Partial<IQuestion>
) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new AppError("Exam not found", StatusCodes.NOT_FOUND);
  }

  const question = (exam.questions as any).id(questionId);
  if (!question) {
    throw new AppError("Question not found", StatusCodes.NOT_FOUND);
  }

  Object.assign(question, data);
  await exam.save();
  return question;
};

const deleteQuestion = async (examId: string, questionId: string) => {
  const result = await Exam.findByIdAndUpdate(
    examId,
    { $pull: { questions: { _id: questionId } } },
    { new: true }
  );
  if (!result) {
    throw new AppError("Exam not found", StatusCodes.NOT_FOUND);
  }
  return result;
};

const publishExam = async (examId: string) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new AppError("Exam not found", StatusCodes.NOT_FOUND);
  }

  if (exam.questions.length === 0) {
    throw new AppError(
      "Cannot publish exam with no questions",
      StatusCodes.BAD_REQUEST
    );
  }

  exam.status = "published";
  await exam.save();
  return exam;
};

const examService = {
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

export default examService;
