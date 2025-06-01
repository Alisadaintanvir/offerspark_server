import { Schema, model, Document, Types } from "mongoose";

// Define the interface for the ADMIN document
interface IAdmin extends Document {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: Types.ObjectId;
  is_super_admin: boolean;
  dob: Date;
  profile_avatar?: string;
  password_reset_token?: string;
  password_reset_expires?: Date;
  status: string;
  refreshToken?: string;
}

// Define the ADMIN schema
const adminSchema = new Schema<IAdmin>(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String },
    role: { type: Schema.Types.ObjectId, ref: "Role", default: null },
    is_super_admin: { type: Boolean, default: false },
    dob: { type: Date },
    profile_avatar: { type: String },
    password_reset_token: { type: String },
    password_reset_expires: { type: Date },
    status: {
      type: String,
      default: "not_verified",
      required: true,
      enum: ["not_verified", "active", "banned"],
    },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

const Admin = model<IAdmin>("Admin", adminSchema);
export default Admin;
