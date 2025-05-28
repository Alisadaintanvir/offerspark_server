import { Request, Response, NextFunction } from "express";
import { PERMISSIONS } from "../common/permission";

// Get all permissions
export const getPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    message: "Permissions retrieved successfully",
    data: PERMISSIONS,
  });
};
