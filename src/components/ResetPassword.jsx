import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const query = useQuery();
  const token = query.get("token") || "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) setError("❌ Missing reset token. Please use the link sent to your email.");
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("❌ Password must be at least 6 characters");
      return;
    }
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const resp = await axios.post("/api/auth/reset-password", { token, newPassword });
      setMessage("✅ " + (resp.data?.message || "Password reset successful"));
      setTimeout(() => navigate("/admin-login"), 2000);
    } catch (err) {
      setError("❌ " + (err.response?.data?.message || "Reset failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Reset Password
        </h2>

        {!token ? (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {error}
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            {message}
          </div>
        )}

        {error && token && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
