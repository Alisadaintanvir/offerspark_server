import Admin from "@/schemas/admin.schema";
import { IRole } from "@/schemas/role.schema";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  saveAccessTokenInCookie,
} from "@/helpers/tokenService";

// Transform admin data to exclude sensitive information
const transformAdminData = (admin: any) => {
  const {
    password,
    password_reset_token,
    password_reset_expires,
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

  // Save access token in cookie
  saveAccessTokenInCookie(res, accessToken);

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
  // Clear the access token cookie
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    message: "Logout successful",
  });
};
