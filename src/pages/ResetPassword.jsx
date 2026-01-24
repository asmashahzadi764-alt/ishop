import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token; // get reset token

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="p-8 max-w-md mx-auto mt-16 bg-white rounded-lg shadow">
        <p className="text-red-600">❌ Invalid or missing token.</p>
      </div>
    );
  }

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Use proxied relative path
      const res = await fetch('/api/admin/reset-password', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("✅ Password reset successful!");
        setTimeout(() => navigate("/admin-login"), 1500);
      } else {
        setMessage(data.message || "Failed to reset password");
      }
    } catch (err) {
      setLoading(false);
      setMessage("❌ Network error. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto mt-16 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      <form onSubmit={handleReset}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full p-2 border mb-4 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
