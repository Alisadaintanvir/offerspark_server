import { Router } from "express";
import { postLogin, getMe, postLogout } from "./auth.controller";
import withErrorHandling from "@/utility/withErrorHandling";
import { loginValidation } from "./auth.validator";
import { validationHandler } from "@/helpers/errorHandler";
import { authenticateToken } from "../common/authMiddleware";

const router = Router();

// Get Admin Profile
router.get("/me", authenticateToken, withErrorHandling(getMe));

router.post(
  "/login",
  loginValidation,
  validationHandler,
  withErrorHandling(postLogin)
);

// Logout route
router.post("/logout", authenticateToken, withErrorHandling(postLogout));

export default router;
