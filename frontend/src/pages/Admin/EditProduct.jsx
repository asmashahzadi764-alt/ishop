import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null); // ✅ For editing
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await axios.get("http://localhost:5001/api/products");
    setProducts(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await axios.delete(`http://localhost:5001/api/products/${id}`);
      fetchProducts();
    }
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setFormData(product);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(
      `http://localhost:5001/api/products/${editProduct._id}`,
      formData
    );
    alert("✅ Product updated successfully!");
    setEditProduct(null);
    fetchProducts();
  };

  return (
    <section className="p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">📦 Manage Products</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="border p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-gray-600">{p.category}</p>
            <p className="text-blue-700 font-semibold">Rs. {p.price}</p>
            <p className="text-sm text-gray-500 mt-1">{p.description}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEditClick(p)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-8 rounded-2xl w-96 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-center mb-4 text-blue-600">
              ✏️ Edit Product
            </h3>
            {["name", "category", "price", "description", "image"].map((key) => (
              <input
                key={key}
                type="text"
                placeholder={key}
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                className="border p-2 rounded w-full mb-3"
                required
              />
            ))}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default ManageProducts;
