import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "@/schemas/admin.schema";
import Role from "@/schemas/role.schema";
import { BCRYPT_SALT_ROUNDS } from "@/constants/value.constants";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

async function seedAdmin() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Ensure Super Admin role exists
  let superAdminRole = await Role.findOne({ name: "Super Admin" });
  if (!superAdminRole) {
    superAdminRole = await Role.create({
      name: "Super Admin",
      description: "Full access to all features",
      permissions: ["*"],
      level: 100, // Highest level
    });
    console.log("Created Super Admin role");
  }

  // Admin credentials (customize as needed)
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";
  const adminPhone = "0123456789";
  const adminName = "Super Admin";
  const adminDOB = new Date("1990-01-01");

  // Check if admin exists
  let admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    const hashedPassword = await bcrypt.hash(adminPassword, BCRYPT_SALT_ROUNDS);
    admin = await Admin.create({
      full_name: adminName,
      email: adminEmail,
      phone: adminPhone,
      password: hashedPassword,
      role: superAdminRole._id,
      is_super_admin: true,
      dob: adminDOB,
      status: "active",
    });
    console.log("Admin user created:", adminEmail);
  } else {
    console.log("Admin user already exists:", adminEmail);
  }

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seedAdmin().catch((err) => {
  console.error("Seeding failed:", err);
  mongoose.disconnect();
});
