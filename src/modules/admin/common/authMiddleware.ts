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

// Check Permissions
export const checkPermissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { user } = req as any;

      // Ensure user exists
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const isSuperAdmin = user.isSuperAdmin;
      if (isSuperAdmin) {
        return next();
      }

      // Extract role and permissions from JWT (set in authenticateToken)
      const userPermissions = user.permissions;

      if (
        !userPermissions ||
        !requiredPermissions.every((p) => userPermissions.includes(p))
      ) {
        return next({ status: 403, message: "Access denied" });
      }

      return next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};
