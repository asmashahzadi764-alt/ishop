import express from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let { name, email, phone, message } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ success: false, message: "Provide email or phone" });
    }

    // Clean phone
    if (phone) {
      phone = phone.replace(/\s+/g, "");
      if (phone.startsWith("0")) phone = "+92" + phone.substring(1);
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save(); // Save to DB

    // Try sending email, but do not break if it fails
    if (email) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "youremail@gmail.com",
            pass: "your-app-password",
          },
        });

        await transporter.sendMail({
          from: '"iShop" <youremail@gmail.com>',
          to: email,
          subject: "Message Received - iShop",
          text: `Hi ${name},\n\nWe received your message:\n\n"${message}"\n\nWe will get back to you soon!`,
        });
      } catch (mailErr) {
        console.error("Email sending failed:", mailErr.message);
        // Do not throw error, continue
      }
    }

    // ✅ Always send success response if DB save is ok
    res.status(201).json({ success: true, message: "Message sent successfully!" });

  } catch (error) {
    console.error("Server Error:", error.message);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
