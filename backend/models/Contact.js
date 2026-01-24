import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^\+923[0-9]{9}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid Pakistani phone number!`,
      },
    },

    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);
export default Contact;
