import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Admin from "@/schemas/admin.schema";
import { verifyAccessToken } from "@/helpers/tokenService";
import { IRole } from "@/schemas/role.schema";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.cookies.accessToken;

  if (!authToken) {
    return next(createError(401, "Unauthorized user"));
  }

  try {
    const decoded = verifyAccessToken(authToken) as any;

    if (!decoded) {
      return next(createError(401, "Unauthorized user"));
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    return next(
      createError(401, "Unauthorized user", {
        errors: error.errors || undefined,
      })
    );
  }
};
