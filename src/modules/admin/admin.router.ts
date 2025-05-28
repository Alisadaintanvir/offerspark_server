import { Router } from "express";
import authRouter from "@/modules/admin/auth/auth.route";
import permissionRouter from "@/modules/admin/permission/permission.route";
import roleRouter from "@/modules/admin/role/role.route";
import userRouter from "@/modules/admin/user/user.routes";
const router = Router();

router.use("/auth", authRouter);
router.use("/permissions", permissionRouter);
router.use("/roles", roleRouter);
router.use("/users", userRouter);

export default router;
