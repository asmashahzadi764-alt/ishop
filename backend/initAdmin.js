// backend/initAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => { console.error(err); process.exit(1); });

const createAdmin = async () => {
  try {
    const exists = await Admin.findOne({ email: "asmashahzadi2007@gmail.com" });
    if (exists) {
      console.log("Admin already exists:", exists.email);
      return process.exit(0);
    }

    const admin = new Admin({
      username: "admin",
      email: "asmashahzadi2007@gmail.com",
      password: "Asma@2007", // will be hashed automatically
    });

    await admin.save();
    console.log("✅ New admin created!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Admin creation failed:", err);
    process.exit(1);
  }
};

createAdmin();
