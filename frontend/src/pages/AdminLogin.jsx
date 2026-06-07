import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API =
  import.meta.env.VITE_API_URL ||
  "https://ishop-backend-a0gx.onrender.com";

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
      const response = await fetch(
        `${API}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailOrUsername: emailOrUsername.trim(),
            password: password.trim(),
          }),
        }
      );

      const text = await response.text();

      console.log("================================");
      console.log("LOGIN API:", `${API}/api/admin/login`);
      console.log("LOGIN RESPONSE STATUS:", response.status);
      console.log("LOGIN RESPONSE BODY:");
      console.log(text);
      console.log("================================");

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error("JSON Parse Error:", err);
      }

      setLoading(false);

      if (response.ok) {
        localStorage.setItem("token", data.token);

        if (data.admin) {
          localStorage.setItem(
            "admin",
            JSON.stringify(data.admin)
          );
        }

        setMessageType("success");
        setMessage("✅ Login successful! Redirecting...");

        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      } else {
        setMessageType("error");
        setMessage(
          `❌ ${data.message || "Invalid username/email or password"}`
        );
      }
    } catch (err) {
      setLoading(false);

      console.error("LOGIN FETCH ERROR:", err);

      setMessageType("error");
      setMessage("❌ Unable to connect to server.");
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Admin Login
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center text-white ${
              messageType === "success"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">
              Username or Email
            </label>

            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) =>
                setEmailOrUsername(e.target.value)
              }
              placeholder="Enter username or email"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline text-sm"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mt-2 text-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-700"
          >
            ← Go to iShop
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;