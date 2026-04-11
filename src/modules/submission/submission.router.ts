import { Router } from "express";
import submissionController from "./submission.controller";
import validateRequest from "../../middleware/validateRequest";
import { submissionValidation } from "./submission.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

// Candidate: submit exam answers
router.post(
  "/:examId/submit",
  auth(USER_ROLE.USER),
  validateRequest(submissionValidation.submitExamSchema),
  submissionController.submitExam
);

// Admin: get all submissions for an exam
router.get(
  "/:examId/submissions",
  auth(USER_ROLE.ADMIN),
  submissionController.getSubmissionsByExam
);

// Candidate: check if already submitted
router.get(
  "/:examId/my-submission",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  submissionController.getMySubmission
);

const submissionRouter = router;
export default submissionRouter;
