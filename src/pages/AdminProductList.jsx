import React, { useEffect, useState } from "react";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Delete product by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(`http://localhost:5001/api/products/${id}`, {
        method: "DELETE",
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Manage Products (Admin)
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-600 text-lg">No products added yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-6 py-3 border-b">Image</th>
                <th className="px-6 py-3 border-b">Name</th>
                <th className="px-6 py-3 border-b">Category</th>
                <th className="px-6 py-3 border-b">Price</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-blue-50">
                  <td className="px-6 py-3 border-b">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-3 border-b font-semibold">{p.name}</td>
                  <td className="px-6 py-3 border-b">{p.category}</td>
                  <td className="px-6 py-3 border-b text-green-700 font-semibold">
                    Rs. {p.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 border-b">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition mr-2"
                    >
                      Delete
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductList;
