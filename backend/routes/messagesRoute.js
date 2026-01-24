import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// Get all messages
router.get("/messages", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a message
router.delete("/messages/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Mark message as read permanently
router.patch("/messages/:id/read", async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message)
      return res.status(404).json({ success: false, message: "Message not found" });

    res.json({ success: true, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
