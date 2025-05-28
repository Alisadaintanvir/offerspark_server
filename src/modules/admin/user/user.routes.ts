import { Router } from "express";

import withErrorHandling from "@/utility/withErrorHandling";
import {
  addUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from "./user.controller";
import { addUserValidator } from "./user.validator";
import { authenticateToken, checkPermissions } from "../common/authMiddleware";
import { validationHandler } from "@/helpers/errorHandler";
import { PERMISSIONS } from "../common/permission";

const router = Router();

router.post(
  "/",
  authenticateToken,
  checkPermissions([PERMISSIONS.USER.CREATE]),
  addUserValidator,
  validationHandler,
  withErrorHandling(addUser)
); // POST /admin/user
router.patch("/:id", withErrorHandling(updateUser)); // PATCH /admin/user/:id
router.delete("/:id", withErrorHandling(deleteUser)); // DELETE /admin/user/:id
router.get(
  "/",
  authenticateToken,
  checkPermissions([PERMISSIONS.USER.READ]),
  withErrorHandling(getAllUsers)
); // GET /admin/user

export default router;
