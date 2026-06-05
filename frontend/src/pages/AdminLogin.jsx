import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Use relative path to let Vite proxy route the request to the admin backend
      const response = await fetch('/api/admin/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrUsername: emailOrUsername.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessageType("success");
        setMessage("✅ Login successful! Redirecting...");

        setTimeout(() => navigate("/admin"), 1500);
      } else {
        setMessageType("error");
        setMessage(`❌ ${data.message || "Invalid credentials!"}`);
      }
    } catch (err) {
      setLoading(false);
      setMessageType("error");
      setMessage("❌ Something went wrong. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Admin Login
        </h2>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-white text-center ${messageType === "success" ? "bg-blue-500" : "bg-red-600"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Username or Email</label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Enter username or email"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline text-sm"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mt-2 text-center">
          <Link to="/" className="text-gray-600 hover:text-blue-700">
            ← Go to iShop
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
