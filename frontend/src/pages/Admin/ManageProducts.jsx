import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        showToast("❌ Failed to load products!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🔹 Toast utility
  const showToast = (text, type = "info") => {
    const color =
      type === "error"
        ? "bg-red-600"
        : type === "success"
        ? "bg-blue-600"
        : "bg-gray-700";
    setToast({ text, color });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔹 Delete product
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:5001/api/products/${deleteId}`);
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
      await axios.put(
        `http://localhost:5001/api/products/${editingProduct._id}`,
        editingProduct
      );
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editingProduct._id ? editingProduct : p
        )
      );
      showToast("✅ Product updated!", "success");
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to update product!", "error");
    }
  };

  // 🔹 Helper for image URL
  const getImageUrl = (product) => {
    if (!product.image && !product.imageFile) return "/images/placeholder.png";
    if (product.image && product.image.startsWith("http")) return product.image;
    if (product.imageFile) return `http://localhost:5001${product.imageFile}`;
    return `http://localhost:5001${product.image}`;
  };

  // 🔹 Loading Spinner
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-600 text-lg font-semibold">
        Loading products...
      </div>
    );

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 ${toast.color} text-white px-5 py-2 rounded-md shadow-md z-50 text-sm`}
        >
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Manage Products
        </h1>
        <p className="text-gray-600 text-lg mt-2 font-medium">
          Easily view, edit, or delete products in your store.
        </p>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found in the store.</p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-4">
          {products.map((item) => (
            <div
              key={item._id}
              className="flex items-center bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg border border-gray-200 transition-transform transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="w-32 h-32 flex-shrink-0">
                <img
                  src={getImageUrl(item)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-500 capitalize">{item.category}</p>
                <p className="text-blue-700 font-semibold mt-1">Rs. {item.price}</p>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.description}</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 px-6">
                <button
                  onClick={() => setEditingProduct(item)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full sm:w-96 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">
              Edit Product
            </h3>

            {["name", "category", "price", "image"].map((field) => (
              <input
                key={field}
                type={field === "price" ? "number" : "text"}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={editingProduct[field]}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    [field]: e.target.value,
                  })
                }
                className="w-full border border-gray-300 p-2 rounded-md mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            ))}
            <textarea
              placeholder="Description"
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, description: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-md mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full sm:w-96 text-center shadow-lg">
            <h3 className="text-xl font-semibold text-red-600 mb-3">Confirm Delete</h3>
            <p className="text-gray-600 mb-5">Are you sure you want to delete this product?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageProducts;
