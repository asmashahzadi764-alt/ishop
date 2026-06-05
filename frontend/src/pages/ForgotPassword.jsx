// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Use proxied relative path
      const response = await fetch('/api/admin/forgot-password', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessageType("success");
        setMessage(`✅ ${data.message}`);
      } else {
        setMessageType("error");
        setMessage(`❌ ${data.message || "Something went wrong!"}`);
      }
    } catch (err) {
      setLoading(false);
      setMessageType("error");
      setMessage("❌ Server error. Please try again.");
      console.error("Forgot password error:", err);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Forgot Password
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-white text-center ${
              messageType === "success" ? "bg-blue-500" : "bg-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter your admin email"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white transition ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Password"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/admin-login"
            className="text-gray-600 hover:text-blue-700 transition duration-200"
          >
            ← Back to Admin Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
