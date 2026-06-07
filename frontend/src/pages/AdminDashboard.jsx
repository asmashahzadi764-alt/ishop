import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  // ✅ Safe API (Render + Vercel + fallback)
  const API =
    import.meta.env.VITE_API_URL ||
    "https://ishop-backend-a0gx.onrender.com";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);

        // ✅ prevent HTML crash issue
        const contentType = res.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          throw new Error("API did not return JSON");
        }

        const data = await res.json();

        if (res.ok) {
          setProducts(data || []);

          // ✅ safe category count
          const uniqueCategories = new Set(
            (data || [])
              .map((p) => p.category)
              .filter(Boolean)
          );

          setStats({
            total: data.length,
            categories: uniqueCategories.size,
          });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // ✅ FIXED (no dependency loop)

  // ✅ Safe image handler
  const getImageUrl = (product) => {
    if (!product?.image && !product?.imageFile)
      return "/images/placeholder.png";

    if (product.image?.startsWith("http"))
      return product.image;

    if (product.imageFile)
      return `${API}${product.imageFile}`;

    if (product.image)
      return `${API}${product.image}`;

    return "/images/placeholder.png";
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-100 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Welcome Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
            👋 Welcome Back, <span className="text-green-900">Admin</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Here’s an overview of your iShop admin dashboard.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Products
            </h3>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {stats.total}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              Categories
            </h3>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {stats.categories}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              Admin
            </h3>
            <p className="text-lg text-gray-600 mt-2">
              Logged in as <span className="font-semibold">Ali Farooqi</span>
            </p>
          </div>

        </div>

        {/* Button */}
        <div className="flex justify-center mb-8">
          <Link
            to="/admin/add-product"
            className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700"
          >
            ➕ Add New Product
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white shadow-xl rounded-2xl p-6">

          <h2 className="text-2xl font-bold mb-4">
            📦 Product List
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 py-10">
              Loading products...
            </p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No products found.
            </p>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b">

                      <td className="p-3">
                        <img
                          src={getImageUrl(product)}
                          alt={product.name || "product"}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>

                      <td className="p-3 font-medium">
                        {product.name || "No Name"}
                      </td>

                      <td className="p-3 capitalize">
                        {product.category || "N/A"}
                      </td>

                      <td className="p-3 font-semibold text-green-600">
                        Rs. {product.price || 0}
                      </td>

                      <td className="p-3 space-x-2">
                        <button className="px-3 py-1 bg-yellow-400 text-white rounded">
                          Edit
                        </button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded">
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default Dashboard;