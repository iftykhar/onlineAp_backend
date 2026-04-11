import { Router } from "express";
import examController from "./exam.controller";
import validateRequest from "../../middleware/validateRequest";
import { examValidation } from "./exam.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

// --- Exam CRUD (Admin) ---
router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  validateRequest(examValidation.createExamSchema),
  examController.createExam
);

router.get("/", auth(USER_ROLE.ADMIN), examController.getAllExams);

// Candidate: get published exams available now
router.get(
  "/available",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  examController.getAvailableExams
);

// Candidate: get exam by slug (hides correct answers)
router.get(
  "/slug/:slug",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  examController.getExamBySlugForCandidate
);

// Admin: get exam by slug (includes answers)
router.get(
  "/admin/slug/:slug",
  auth(USER_ROLE.ADMIN),
  examController.getExamBySlug
);

router.get("/:id", auth(USER_ROLE.ADMIN), examController.getExamById);

router.put(
  "/:id",
  auth(USER_ROLE.ADMIN),
  validateRequest(examValidation.updateExamSchema),
  examController.updateExam
);

router.delete("/:id", auth(USER_ROLE.ADMIN), examController.deleteExam);

// --- Question Management (Admin) ---
router.post(
  "/:id/questions",
  auth(USER_ROLE.ADMIN),
  validateRequest(examValidation.addQuestionSchema),
  examController.addQuestion
);

router.put(
  "/:id/questions/:questionId",
  auth(USER_ROLE.ADMIN),
  validateRequest(examValidation.updateQuestionSchema),
  examController.updateQuestion
);

router.delete(
  "/:id/questions/:questionId",
  auth(USER_ROLE.ADMIN),
  examController.deleteQuestion
);

// --- Publish ---
router.patch("/:id/publish", auth(USER_ROLE.ADMIN), examController.publishExam);

const examRouter = router;
export default examRouter;
