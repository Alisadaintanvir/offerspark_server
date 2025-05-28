import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Role from "@/schemas/role.schema";

// Get all roles
export const getRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const roles = await Role.find().sort({ createdAt: -1 });

  res.status(200).json({
    message: "Roles retrieved successfully",
    data: roles,
  });
};

// Create a new role
export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, permissions } = req.body;

  // Check if role with same name exists
  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    return next(createHttpError(409, "Role with this name already exists"));
  }

  const role = await Role.create({
    name,
    description,
    permissions,
  });

  res.status(201).json({
    message: "Role created successfully",
    data: role,
  });
};

// Update a role
export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, description, permissions } = req.body;

  // Check if role exists
  const role = await Role.findById(id);
  if (!role) {
    return next(createHttpError(404, "Role not found"));
  }

  // If name is being changed, check if new name already exists
  if (name && name !== role.name) {
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return next(createHttpError(409, "Role with this name already exists"));
    }
  }

  // Update role
  const updatedRole = await Role.findByIdAndUpdate(
    id,
    {
      name,
      description,
      permissions,
    },
    { new: true }
  );

  res.status(200).json({
    message: "Role updated successfully",
    data: updatedRole,
  });
};

// Delete a role
export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  // Check if role exists
  const role = await Role.findById(id);
  if (!role) {
    return next(createHttpError(404, "Role not found"));
  }

  // Delete the role
  await Role.findByIdAndDelete(id);

  res.status(200).json({
    message: "Role deleted successfully",
  });
};
