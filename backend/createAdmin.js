import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const existingAdmin = await Admin.findOne({
      email: "admin@gmail.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    const admin = new Admin({
      username: "admin",
      email: "admin@gmail.com",
      password: "123456",
      isAdmin: true,
    });

    await admin.save();

    console.log("✅ Admin Created Successfully");
    console.log("Email: admin@gmail.com");
    console.log("Password: 123456");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createAdmin();