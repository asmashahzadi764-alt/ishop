import React, { useState } from "react";
import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "https://ishop-backend-a0gx.onrender.com";

// Toast
const Toast = ({ message, type }) => (
  <div
    className={`fixed top-5 right-5 px-5 py-3 rounded-lg text-white shadow-lg z-50
    ${type === "success" ? "bg-green-500" : "bg-red-500"}`}
  >
    {message}
  </div>
);

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      showToast("Registration successful ✅", "success");

      console.log(res.data);

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.error(err);

      showToast(
        err.response?.data?.message ||
          "Registration failed ❌",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 mb-3 rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 mb-3 rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 mb-3 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded ${
              loading
                ? "bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      {/* Toast */}
      {toast && <Toast {...toast} />}
    </div>
  );
}

export default Register;