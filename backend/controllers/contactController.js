// controllers/contactController.js
import Contact from "../models/contactModel.js";

// ---------------------------------------
// SEND CONTACT MESSAGE
// ---------------------------------------
export const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMsg = await Contact.create({
      name,
      email,
      message,
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: newMsg,
    });
  } catch (error) {
    console.log("Contact Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------
// GET ALL MESSAGES (Admin Only)
// ---------------------------------------
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    console.log("Get Messages Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------
// DELETE MESSAGE
// ---------------------------------------
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const msg = await Contact.findByIdAndDelete(id);

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Delete Message Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
