import { Router } from "express";
import { getPermissions } from "./permission.controller";
import withErrorHandling from "@/utility/withErrorHandling";
import { authenticateToken } from "../common/authMiddleware";

const router = Router();

// Get all permissions
router.get("/", authenticateToken, withErrorHandling(getPermissions));

export default router;
