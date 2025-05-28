import {body} from "express-validator";

export const userValidator = () => {
    return [body("name").isString().withMessage("name must be a string").notEmpty().withMessage("name must not be empty"
    )];
};