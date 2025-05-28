import { body } from "express-validator";

const emailValidation = body("email")
  .notEmpty()
  .withMessage("Email is required")
  .trim()
  .isEmail()
  .withMessage("Invalid email address")
  .normalizeEmail();

// Login Validation
export const loginValidation = [
  emailValidation,
  body("password").notEmpty().withMessage("Password is required").trim(),
];
