import React, { useState } from "react";
import axios from "axios";

// API base (Vercel + production safe)
const API =
  import.meta.env.VITE_API_URL ||
  "https://ishop-backend-a0gx.onrender.com";

// Toast Component
const Toast = ({ message, type }) => (
  <div
    className={`fixed top-5 right-5 px-6 py-3 rounded-xl shadow-lg text-white z-50 transition-all duration-300
      ${type === "success" ? "bg-green-500" : "bg-red-500"}`}
  >
    {message}
  </div>
);

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) errs.name = "Name is required";

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errs.email = "Invalid email address";
    }

    if (
      formData.phone &&
      !/^(\+92|0)?3[0-9]{9}$/.test(formData.phone)
    ) {
      errs.phone = "Invalid Pakistani phone number";
    }

    if (!formData.email && !formData.phone) {
      errs.contact = "Provide email or phone";
    }

    if (!formData.message.trim()) {
      errs.message = "Message is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/contact`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      showToast(
        res.data?.message || "Message sent successfully!",
        "success"
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setErrors({});
      setShowInfo(false);
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message || "Server error",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-blue-100 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center text-blue-800 mb-3">
          Get in Touch
        </h2>

        <p className="text-center text-gray-700 mb-10">
          Send us a message — we’ll respond quickly
        </p>

        <div className="grid md:grid-cols-2 gap-10">

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-xl"
          >

            {/* Name */}
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border p-3 mb-2 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}

            {/* Email */}
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email (optional)"
              className="w-full border p-3 mt-3 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            {/* Phone */}
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone (optional)"
              className="w-full border p-3 mt-3 rounded"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}

            {errors.contact && (
              <p className="text-red-500 text-sm mt-2">
                {errors.contact}
              </p>
            )}

            {/* Message */}
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              className="w-full border p-3 mt-3 rounded"
              rows="4"
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 mt-4 rounded hover:bg-blue-700"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* INFO / MAP */}
          {showInfo && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <iframe
                title="map"
                src="https://www.google.com/maps/embed?pb=!1m18..."
                width="100%"
                height="350"
                loading="lazy"
              ></iframe>

              <div className="p-5">
                <h3 className="font-bold text-blue-700">
                  iShop Store
                </h3>
                <p className="text-gray-600">
                  Hyderabad, Pakistan
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Toast */}
      {toast && <Toast {...toast} />}
    </section>
  );
}

export default Contact;