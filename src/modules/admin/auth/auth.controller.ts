import Admin from "@/schemas/admin.schema";
import { IRole } from "@/schemas/role.schema";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshTokenInCookie,
  verifyRefreshToken,
} from "@/helpers/tokenService";

// Transform admin data to exclude sensitive information
const transformAdminData = (admin: any) => {
  const {
    password,
    password_reset_token,
    password_reset_expires,
    refreshToken,
    ...adminData
  } = admin.toObject();
  return adminData;
};

// Get current admin profile
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: adminId } = req.user as any;

  const admin = await Admin.findById(adminId);

  if (!admin) {
    return next(createHttpError(404, "Admin not found"));
  }

  res.status(200).json({
    message: "Admin profile retrieved successfully",
    data: transformAdminData(admin),
  });
};

// Admin Login
export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  // Check if admin exists
  const existingAdmin = await Admin.findOne({ email }).populate<{
    role: IRole;
  }>("role");
  if (!existingAdmin) {
    return next(createHttpError(404, "Admin not found"));
  }

  // Check if password is correct
  const isPasswordValid = await bcrypt.compare(
    password,
    existingAdmin.password
  );
  if (!isPasswordValid) {
    return next(createHttpError(401, "Invalid credentials"));
  }

  // Extract role name and permissions
  const isSuperAdmin = existingAdmin.is_super_admin;
  const roleName = existingAdmin.role?.name;
  const permissions = existingAdmin?.role?.permissions;

  const tokenData = {
    id: existingAdmin._id + "",
    email,
    isSuperAdmin,
    role: roleName,
    permissions,
  };

  // Generate access token
  const accessToken = generateAccessToken(tokenData);
  // Generate refresh token
  const refreshToken = generateRefreshToken(tokenData);

  // Save refresh token in DB
  existingAdmin.refreshToken = refreshToken;
  await existingAdmin.save();

  // Save tokens in cookies
  saveRefreshTokenInCookie(res, refreshToken);

  res.status(201).json({
    message: "Login successful",
    data: transformAdminData(existingAdmin),
    accessToken,
  });
};

// Admin Logout
export const postLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Clear the refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // Remove refresh token from DB if present
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const admin = await Admin.findById(payload.id);
      if (admin && admin.refreshToken === refreshToken) {
        admin.refreshToken = undefined;
        await admin.save();
      }
    } catch (err) {
      // Ignore errors: token may be invalid/expired
    }
  }

  res.status(200).json({
    message: "Logout successful",
  });
};

// Refresh Token endpoint
export const postRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return next(createHttpError(401, "Refresh token missing"));
  }
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    return next(createHttpError(403, "Invalid refresh token"));
  }
  const admin = await Admin.findById(payload.id).populate<{ role: IRole }>(
    "role"
  );
  if (!admin || admin.refreshToken !== refreshToken) {
    return next(createHttpError(403, "Refresh token not recognized"));
  }

  // Build a fresh payload from the latest admin data
  const tokenData = {
    id: admin._id + "",
    email: admin.email,
    isSuperAdmin: admin.is_super_admin,
    role: admin.role?.name,
    permissions: admin.role?.permissions,
  };

  // Replace old refresh token with a new one (rotation)
  const newRefreshToken = generateRefreshToken(tokenData);
  admin.refreshToken = newRefreshToken;
  await admin.save();
  saveRefreshTokenInCookie(res, newRefreshToken);
  const newAccessToken = generateAccessToken(tokenData);

  res.status(200).json({
    message: "Token refreshed",
    accessToken: newAccessToken,
  });
};
