import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", formData);
      alert("Registration successful ✅");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error during registration ❌");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", textAlign: "center" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: "100%", margin: "10px 0", padding: "8px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%", margin: "10px 0", padding: "8px" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", margin: "10px 0", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
