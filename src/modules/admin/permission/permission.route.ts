import { Router } from "express";
import { getPermissions } from "./permission.controller";
import withErrorHandling from "@/utility/withErrorHandling";
import { authenticateToken, checkPermissions } from "../common/authMiddleware";
import { PERMISSIONS } from "../common/permission";

const router = Router();

// Get all permissions
router.get(
  "/",
  authenticateToken,
  checkPermissions([PERMISSIONS.PERMISSION.READ]),
  withErrorHandling(getPermissions)
);

export default router;
