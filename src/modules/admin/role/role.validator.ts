import { body } from "express-validator";

export const roleValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Role name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Role name must be between 3 and 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must not exceed 200 characters"),

  body("permissions")
    .isArray()
    .withMessage("Permissions must be an array")
    .notEmpty()
    .withMessage("At least one permission is required"),
];
