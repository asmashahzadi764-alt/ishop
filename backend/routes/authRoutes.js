import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { sendEmailResend } from "../utils/sendEmailResend.js";

const router = express.Router();

// In-memory token store for demo. Production: use DB with hashed token.
const passwordResetTokens = new Map(); // token -> { email, expiresAt }

/**
 * POST /api/auth/forgot-password
 * body: { email }
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") return res.status(400).json({ message: "Valid email is required" });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      // do not reveal whether email exists
      return res.json({ message: "If that email is registered, a reset link was sent." });
    }

    // generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    passwordResetTokens.set(token, { email: admin.email, expiresAt });

    const FRONTEND_BASE = process.env.FRONTEND_URL || "http://localhost:5174";
    const resetLink = `${FRONTEND_BASE.replace(/\/$/, "")}/reset-password?token=${token}`;

    const from = process.env.EMAIL_FROM || `iShop Admin <no-reply@myishop.com>`;
    const subject = "iShop Admin Password Reset";
    const html = `<p>Click the link below to reset your password (expires in 15 minutes):</p>
                  <p><a href="${resetLink}">${resetLink}</a></p>`;

    try {
      const sendResp = await sendEmailResend({ from, to: admin.email, subject, html });
      console.log("forgot-password: send response:", sendResp && (sendResp.data || sendResp));
      // If using the Ethereal fallback in development, return the preview URL so dev can view the message.
      if (process.env.NODE_ENV !== "production" && sendResp && sendResp.provider === "ethereal") {
        // In dev, also log the reset link and token for easy manual testing
        console.log("\n========== 🔐 PASSWORD RESET (DEV) ==========");
        console.log(`Email: ${admin.email}`);
        console.log(`Reset Token: ${token}`);
        console.log(`Reset Link: ${resetLink}`);
        console.log(`Ethereal Preview: ${sendResp.previewUrl}`);
        console.log("==========================================\n");
        return res.json({ message: "If that email is registered, a reset link was sent.", previewUrl: sendResp.previewUrl, token, resetLink });
      }
    } catch (sendErr) {
      console.error("forgot-password: email send failed:", sendErr && (sendErr.response?.data || sendErr.message || sendErr));
      if (process.env.NODE_ENV !== "production") {
        // In dev, prefer to return a helpful error so developer can adjust quickly.
        return res.status(500).json({ message: "Failed sending email (dev)", error: String(sendErr?.response?.data || sendErr?.message || sendErr) });
      }
      return res.json({ message: "If that email is registered, a reset link was sent." });
    }

    return res.json({ message: "If that email is registered, a reset link was sent." });
  } catch (err) {
    console.error("forgot-password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/reset-password
 * body: { token, newPassword }
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || typeof token !== "string") return res.status(400).json({ message: "Token is required" });
    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });

    const entry = passwordResetTokens.get(token);
    if (!entry) return res.status(400).json({ message: "Invalid or expired token" });
    if (entry.expiresAt < new Date()) {
      passwordResetTokens.delete(token);
      return res.status(400).json({ message: "Token has expired" });
    }

    const admin = await Admin.findOne({ email: entry.email });
    if (!admin) {
      passwordResetTokens.delete(token);
      return res.status(400).json({ message: "Invalid request" });
    }

    console.log("reset-password: admin found, email:", admin.email);
    
    // DO NOT manually hash here — just set plaintext password
    // The pre-save hook in Admin model will hash it automatically
    admin.password = newPassword;
    admin.otp = undefined;
    admin.markModified('password');
    
    console.log("reset-password: plaintext password set, will be hashed by pre-save hook");
    
    await admin.save();
    
    console.log("reset-password: admin saved to DB with hashed password");

    passwordResetTokens.delete(token);
    return res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("reset-password error:", err && (err.stack || err));
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

