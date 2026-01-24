// backend/controllers/adminController.js
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const signToken = (admin) =>
  jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      username: admin.username,
      isAdmin: admin.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

export const loginAdmin = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    const admin = await Admin.findOne({
      $or: [{ username: emailOrUsername }, { email: emailOrUsername.toLowerCase() }],
    });

    if (!admin) return res.status(400).json({ message: "Invalid username/email or password" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid username/email or password" });

    admin.lastLogin = new Date();
    await admin.save();

    const token = signToken(admin);
    res.json({
      message: "Login successful",
      token,
      admin: { username: admin.username, email: admin.email },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: "Email is required" });

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(404).json({ message: "Email not found" });

    const resetToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // transporter using env
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `iShop Admin <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: "iShop Admin Password Reset",
      html: `<p>Click this link to reset password:</p><a href="${resetLink}">${resetLink}</a>
             <p>This link expires in 15 minutes.</p>`,
    });

    res.json({ message: "Reset link sent to email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ message: "New password must be at least 6 characters" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(400).json({ message: "Invalid token or admin not found" });

    admin.password = newPassword; // pre-save hook will hash
    await admin.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Error:", err.message);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};
