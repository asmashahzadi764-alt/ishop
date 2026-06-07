import React, { useState } from "react";
import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "https://ishop-backend-a0gx.onrender.com";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("category", product.category);

      if (file) {
        formData.append("imageFile", file);
      } else {
        formData.append("image", product.image);
      }

      const { data } = await axios.post(
        `${API}/api/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Product added successfully!");

      setProduct({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
      });

      setFile(null);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
          ➕ Add Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL (optional)"
            value={product.image}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-3 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="iphone">iPhone</option>
            <option value="ipad">iPad</option>
            <option value="macbook">MacBook</option>
            <option value="imac">iMac</option>
            <option value="airpods">AirPods</option>
            <option value="applewatch">Apple Watch</option>
            <option value="appletv">Apple TV</option>
            <option value="accessories">Accessories</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>

        {/* MESSAGE */}
        {message && (
          <p className="text-center mt-4 font-semibold">
            {message}
          </p>
        )}

        {/* IMAGE PREVIEW */}
        {(file || product.image) && (
          <div className="mt-5 text-center">
            <p className="font-semibold mb-2">Preview:</p>

            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : product.image.startsWith("http")
                  ? product.image
                  : `${API}${product.image}`
              }
              className="w-32 h-32 object-cover mx-auto rounded"
              alt="preview"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default AddProduct;