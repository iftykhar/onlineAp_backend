import { Router } from "express";
import userRouter from "../modules/user/user.router";
import authRouter from "../modules/auth/auth.router";
import contactRouter from "../modules/contact/contact.router";
import examRouter from "../modules/exam/exam.router";
import submissionRouter from "../modules/submission/submission.router";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/contact",
    route: contactRouter,
  },
  {
    path: "/exam",
    route: examRouter,
  },
  {
    path: "/submission",
    route: submissionRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
