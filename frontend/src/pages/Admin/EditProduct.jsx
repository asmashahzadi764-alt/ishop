import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ IMPORTANT: use backend URL (Vercel safe)
const API =
  import.meta.env.VITE_API_URL ||
  "https://ishop-backend-a0gx.onrender.com";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${API}/api/products`);

      // ✅ safety check (fix sort / map crash)
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.warn("Products API returned non-array:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  // ================= EDIT =================
  const handleEditClick = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name || "",
      category: product.category || "",
      price: product.price || "",
      description: product.description || "",
      image: product.image || "",
    });
  };

  // ================= UPDATE =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API}/api/products/${editProduct._id}`,
        formData
      );

      alert("✅ Product updated!");
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Update failed!");
    }
  };

  return (
    <section className="p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        📦 Manage Products
      </h2>

      {/* LOADING */}
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="border p-4 rounded-xl shadow"
            >
              <img
                src={
                  p.image?.startsWith("http")
                    ? p.image
                    : `${API}${p.image}`
                }
                alt={p.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-gray-600">{p.category}</p>
              <p className="text-blue-700 font-semibold">
                Rs. {p.price}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {p.description}
              </p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEditClick(p)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-xl w-96"
          >
            <h3 className="text-xl font-bold mb-4">
              Edit Product
            </h3>

            {["name", "category", "price", "description", "image"].map(
              (key) => (
                <input
                  key={key}
                  type="text"
                  placeholder={key}
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [key]: e.target.value,
                    })
                  }
                  className="border p-2 w-full mb-2 rounded"
                />
              )
            )}

            <div className="flex justify-between mt-3">
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="bg-gray-400 px-3 py-1 rounded text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-blue-600 px-3 py-1 rounded text-white"
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