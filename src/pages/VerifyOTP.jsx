import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email"); // get email from query

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (otp.trim().length === 0) {
      setMessageType("error");
      setMessage("❌ Please enter the OTP");
      setLoading(false);
      return;
    }

    try {
      // Use proxied relative path
      const response = await fetch('/api/admin/verify-otp', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessageType("success");
        setMessage("✅ OTP verified! Redirecting to reset password...");

        setTimeout(() => {
          navigate(`/reset-password`, { state: { token: data.resetToken } });
        }, 1500);
      } else {
        setMessageType("error");
        setMessage(`❌ ${data.message || "Invalid OTP"}`);
      }
    } catch (err) {
      setLoading(false);
      setMessageType("error");
      setMessage("❌ Something went wrong. Please try again.");
      console.error("OTP verify error:", err);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Verify OTP
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
            <label className="block text-gray-600 mb-1">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to your email"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default VerifyOTP;
