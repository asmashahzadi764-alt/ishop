// frontend/src/pages/RequestOTP.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RequestOTP = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Use proxied relative path
      const res = await fetch('/api/admin/request-otp', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessageType("success");
        setMessage("✅ OTP sent to your email!");
        setTimeout(() => navigate(`/verify-otp?email=${email}`), 1500);
      } else {
        setMessageType("error");
        setMessage(`❌ ${data.message || "Failed to send OTP"}`);
      }
    } catch (err) {
      setLoading(false);
      setMessageType("error");
      setMessage("❌ Something went wrong. Try again.");
      console.error(err);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Request OTP
        </h2>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-white text-center ${messageType === "success" ? "bg-blue-500" : "bg-red-600"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your admin email"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/admin-login" className="text-gray-600 hover:text-blue-700">
            ← Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RequestOTP;
