import React, { useState } from "react";
import axios from "axios";

// Toast Component
const Toast = ({ message, type }) => (
  <div
    className={`fixed top-5 right-5 px-6 py-3 rounded-xl shadow-lg text-white z-50 transition-all duration-300
      ${type === "success" ? "bg-green-500" : "bg-red-500"}`}
    style={{ animation: "fadein 0.3s, fadeout 0.5s 2.5s forwards" }}
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
  const [showInfo, setShowInfo] = useState(true); // Info section visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email address";

    if (formData.phone && !/^(\+92|0)?3[0-9]{9}$/.test(formData.phone))
      errs.phone = "Phone must be a valid Pakistani number";

    if (!formData.email && !formData.phone)
      errs.contact = "Please provide at least email or phone";

    if (!formData.message.trim()) errs.message = "Message is required";

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
      const res = await axios.post("http://localhost:5000/api/contact", formData);

      showToast(res.data.message || "Message sent successfully!", "success");

      // Clear form
      setFormData({ name: "", email: "", phone: "", message: "" });
      setErrors({});

      // Hide info section
      setShowInfo(false);
    } catch (err) {
      showToast(err.response?.data?.message || "Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
<section id="contact" className="py-20 bg-gradient-to-b from-blue-100 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-blue-800 mb-4">
          Get in Touch
        </h2>
        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12">
          Have questions or need help? Send us a message — our iShop support team is here!
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-3xl shadow-xl border border-blue-200 hover:shadow-2xl transition"
          >
            {/* Name */}
            <div className="mb-5">
              <label className="block text-blue-800 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.name ? "border-red-500" : "border-blue-300"
                }`}
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-blue-800 font-semibold mb-2">Email (optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.email ? "border-red-500" : "border-blue-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="mb-5">
              <label className="block text-blue-800 font-semibold mb-2">Phone (optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.phone ? "border-red-500" : "border-blue-300"
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Contact validation */}
            {errors.contact && <p className="text-red-500 text-sm mb-3">{errors.contact}</p>}

            {/* Message */}
            <div className="mb-5">
              <label className="block text-blue-800 font-semibold mb-2">Message</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.message ? "border-red-500" : "border-blue-300"
                }`}
                required
              ></textarea>
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 active:scale-95 transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* Map + Info */}
          {showInfo && (
            <div className="rounded-3xl overflow-hidden shadow-xl border border-blue-200 bg-white">
              <iframe
                title="iShop Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2825.30932317416!2d68.3611180742194!3d25.392043177586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x394c71613ccbf9f1%3A0x84d1b05a08b2dea6!2siShop%20BY%20Ali%20Farooqi!5e1!3m2!1sen!2sus!4v1763641521923!5m2!1sen!2sus"
                width="100%"
                height="420"
                style={{ border: 0, borderRadius: "1.5rem" }}
                allowFullScreen
                loading="lazy"
              ></iframe>

              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-2">iShop by Ali Faqoori</h3>
                <p className="text-gray-700 leading-relaxed">
                  Shop #4, Adjacent to Soneri Bank,<br />
                  Saddar Cantt, Hyderabad (Sindh), Pakistan
                </p>
                <p className="text-gray-800 mt-3 font-medium">📞 +92 300 1234567</p>
                <p className="text-gray-800 font-medium">✉️ ishopbyalifarooqui@gmail.com</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </section>
  );
}

export default Contact;
