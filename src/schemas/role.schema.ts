import { Document, Schema, model } from "mongoose";

export interface IRole extends Document {
  name: string;
  description: string;
  permissions: string[];
  level: number;
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    permissions: { type: [String], default: [] },
    level: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Role = model<IRole>("Role", RoleSchema);

export default Role;
