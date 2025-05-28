import { Request, Response, NextFunction } from "express";
import httpError from "http-errors";
import Admin from "@/schemas/admin.schema";
import bcrypt from "bcryptjs";
import { BCRYPT_SALT_ROUNDS } from "@/constants/value.constants";
export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { full_name, email, phone, password, role } = req.body;

  const existingUser = await Admin.findOne({ email });
  if (existingUser) {
    return next(httpError(400, "User already exists"));
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const newUser = new Admin({
    full_name,
    email,
    phone,
    password: hashedPassword,
    role,
  });

  await newUser.save();

  const userObj = newUser.toObject();
  const { password: _pw, ...userWithoutPassword } = userObj;

  res.status(201).json({
    message: "User created successfully",
    data: userWithoutPassword,
  });
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allUser = await Admin.find().populate("role").select("-password");

  res.status(200).json({
    message: "Users fetched successfully",
    data: allUser,
  });
};
