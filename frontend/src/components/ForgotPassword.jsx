import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setPreviewUrl(null);
    setLoading(true);
    try {
      const resp = await axios.post("/api/auth/forgot-password", { email });
      setMessage(resp.data?.message || "If registered, check your email.");
      // In development, show the Ethereal preview URL if available
      if (resp.data?.previewUrl) {
        setPreviewUrl(resp.data.previewUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Forgot Password?
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            ✅ {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            ❌ {error}
          </div>
        )}

        {previewUrl && (
          <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-400 rounded-lg">
            <p className="text-sm font-bold text-blue-800 mb-2">
              📧 [DEV] Email Preview Available
            </p>
            <p className="text-xs text-blue-700 mb-3">
              Check the backend console for the reset token and link, or click below to preview:
            </p>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition"
            >
              Open Email Preview
            </a>
            <p className="text-xs text-gray-600 mt-2">
              💡 If preview doesn't work, copy the token from backend console.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/admin-login"
            className="text-sm text-purple-600 hover:text-purple-800 font-semibold transition"
          >
            ← Back to Admin Login
          </Link>
        </div>
      </div>
    </section>
  );
}
