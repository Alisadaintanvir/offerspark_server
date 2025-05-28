import { body } from "express-validator";

export const addUserValidator = [
  body("full_name")
    .isString()
    .withMessage("full_name must be a string")
    .notEmpty()
    .withMessage("full_name must not be empty"),
  body("email")
    .isEmail()
    .withMessage("email must be a valid email")
    .notEmpty()
    .withMessage("email must not be empty"),
  body("phone")
    .isString()
    .withMessage("phone must be a string")
    .notEmpty()
    .withMessage("phone must not be empty"),
  body("password")
    .isString()
    .withMessage("password must be a string")
    .notEmpty()
    .withMessage("password must not be empty"),
  body("role")
    .isString()
    .withMessage("role must be a string")
    .notEmpty()
    .withMessage("role must not be empty"),
];
