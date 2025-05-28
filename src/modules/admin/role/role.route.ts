import { Router } from "express";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "./role.controller";
import withErrorHandling from "@/utility/withErrorHandling";
import { roleValidation } from "./role.validator";
import { validationHandler } from "@/helpers/errorHandler";
import { authenticateToken } from "../common/authMiddleware";

const router = Router();

// Get all roles
router.get("/", authenticateToken, withErrorHandling(getRoles));

// Create a new role
router.post(
  "/",
  authenticateToken,
  roleValidation,
  validationHandler,
  withErrorHandling(createRole)
);

// Update a role
router.patch(
  "/:id",
  authenticateToken,
  roleValidation,
  validationHandler,
  withErrorHandling(updateRole)
);

// Delete a role
router.delete("/:id", authenticateToken, withErrorHandling(deleteRole));

export default router;
