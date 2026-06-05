import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  const [file, setFile] = useState(null); // For local file
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Validation: name, price, category, and either URL or file required
    if (!product.name || !product.price || (!product.image && !file) || !product.category) {
      setMessage("⚠️ Please fill all required fields!");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("category", product.category);

      // Append either file or URL
      if (file) {
        formData.append("imageFile", file);
      } else {
        formData.append("image", product.image);
      }

      const response = await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Product added successfully!");
      setProduct({ name: "", price: "", description: "", image: "", category: "" });
      setFile(null);
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Server error. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          ➕ Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={product.image}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            rows={4}
          ></textarea>

          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          >
            <option value="">-- Select Category --</option>
            <option value="iphone">iPhone</option>
            <option value="ipad">iPad</option>
            <option value="imac">iMac</option>
            <option value="macbook">MacBook</option>
            <option value="airpods">AirPods</option>
            <option value="applewatch">Apple Watch</option>
            <option value="appletv">Apple TV</option>
            <option value="accessories">Accessories</option>
            <option value="entertainment">Entertainment</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white px-6 py-3 rounded-lg transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center text-lg font-semibold mt-4 ${
              message.includes("✅")
                ? "text-blue-600"
                : message.includes("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* ✅ Preview uploaded image */}
        {(file || product.image) && (
          <div className="mt-4 text-center">
            <p className="font-semibold mb-2">Preview:</p>
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : product.image.startsWith("http")
                  ? product.image
                  : `http://localhost:5000${product.image}`
              }
              alt="Preview"
              className="mx-auto w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default AddProduct;
