import { Router } from "express";
import userController from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { userValidation } from "./user.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./user.constant";
import { upload } from "../../middleware/multer.middleware";

const router = Router();

// Public — register new user (direct, no OTP)
router.post(
  "/register",
  validateRequest(userValidation.userValidationSchema),
  userController.registerUser
);

// Protected — get current user profile (used by frontend /me)
router.get(
  "/me",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  userController.getMyProfile
);

// Protected — get current user profile (alias)
router.get(
  "/my-profile",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  userController.getMyProfile
);

// Admin only
router.get("/all-users", auth(USER_ROLE.ADMIN), userController.getAllUsers);

// Protected — update profile with optional image upload
router.put(
  "/update-profile",
  upload.single("image"),
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  userController.updateUserProfile
);

// Protected — get admin ID (used for notification targeting)
router.get(
  "/admin_id",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  userController.getAdminId
);

const userRouter = router;
export default userRouter;
