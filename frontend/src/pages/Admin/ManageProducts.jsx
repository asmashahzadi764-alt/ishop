import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL; // ✅ Render / Env URL

  // 🔹 Toast
  const showToast = (text, type = "info") => {
    const color =
      type === "error"
        ? "bg-red-600"
        : type === "success"
        ? "bg-green-600"
        : "bg-gray-700";

    setToast({ text, color });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔹 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
        showToast("❌ Failed to load products!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Delete product
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`${API}/api/products/${deleteId}`);
      setProducts((prev) => prev.filter((p) => p._id !== deleteId));
      showToast("🗑️ Product deleted!", "success");
    } catch (err) {
      showToast("❌ Failed to delete product!", "error");
    } finally {
      setDeleteId(null);
    }
  };

  // 🔹 Update product
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${API}/api/products/${editingProduct._id}`,
        editingProduct
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === editingProduct._id ? res.data : p
        )
      );

      showToast("✅ Product updated!", "success");
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to update product!", "error");
    }
  };

  // 🔹 Image helper (PRODUCTION SAFE)
  const getImageUrl = (product) => {
    if (!product) return "/images/placeholder.png";

    if (product.image?.startsWith("http")) {
      return product.image;
    }

    if (product.imageFile) {
      return `${API}${product.imageFile}`;
    }

    if (product.image) {
      return `${API}${product.image}`;
    }

    return "/images/placeholder.png";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-600 text-lg font-semibold">
        Loading products...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 ${toast.color} text-white px-5 py-2 rounded-md shadow-md z-50 text-sm`}
        >
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-700">
          Manage Products
        </h1>
        <p className="text-gray-600 mt-2">
          View, edit, and delete products easily
        </p>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No products found.
        </p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-4">
          {products.map((item) => (
            <div
              key={item._id}
              className="flex bg-white shadow-md rounded-2xl overflow-hidden border hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="w-32 h-32 flex-shrink-0">
                <img
                  src={getImageUrl(item)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 p-4">
                <h3 className="text-lg font-semibold">
                  {item.name || "No name"}
                </h3>
                <p className="text-gray-500 capitalize">
                  {item.category || "N/A"}
                </p>
                <p className="text-blue-700 font-bold">
                  Rs. {item.price ?? 0}
                </p>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {item.description || "No description"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col justify-center gap-2 p-4">
                <button
                  onClick={() => setEditingProduct(item)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-96 p-6 rounded-2xl">

            <h2 className="text-xl font-bold mb-4 text-center">
              Edit Product
            </h2>

            {["name", "category", "price", "image"].map((field) => (
              <input
                key={field}
                value={editingProduct[field] || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    [field]: e.target.value,
                  })
                }
                placeholder={field}
                className="w-full border p-2 mb-3 rounded"
              />
            ))}

            <textarea
              value={editingProduct.description || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
              className="w-full border p-2 mb-3 rounded"
              placeholder="Description"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl text-center">

            <h2 className="text-lg font-bold text-red-600">
              Delete Product?
            </h2>

            <p className="text-gray-600 my-3">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-300 px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default ManageProducts;