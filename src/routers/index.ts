import { Router } from "express";

import adminRouter from "@/modules/admin/admin.router";

const router = Router();

router.use("/admin", adminRouter);

export default router;
