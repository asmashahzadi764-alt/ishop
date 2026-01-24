import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateAdmin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Fetch current admin info from token (optional)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchAdmin = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch (err) {
        console.error("Fetch Admin Error:", err);
      }
    };
    fetchAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");
    if (!token) return setError("Not authenticated");

    try {
      const res = await axios.put(
        "/api/admin/update",
        { username, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      setPassword(""); // clear password
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Update Admin Info</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current"
          />
        </div>

        <button type="submit" style={{ marginTop: "15px" }}>
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateAdmin;
