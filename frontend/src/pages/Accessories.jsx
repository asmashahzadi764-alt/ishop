import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL 
  || "https://ishop-backend-a0gx.onrender.com";

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products`);
        const data = await response.json();

        const filtered = data.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase().trim() === "accessories"
        );

        setAccessories(filtered);
      } catch (error) {
        console.error("Error fetching accessories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  // ✅ Image helper (production-safe)
  const getImageUrl = (product) => {
    if (!product.image && !product.imageFile)
      return "/images/placeholder.png";

    // Full URL already
    if (product.image?.startsWith("http")) return product.image;

    // Uploaded file
    if (product.imageFile)
      return `${API_BASE}${product.imageFile}`;

    // backend stored path
    return `${API_BASE}${product.image}`;
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-16">

      {/* Banner */}
      <div
        className="w-full bg-cover bg-center rounded-3xl overflow-hidden shadow-lg relative mb-12"
        style={{ backgroundImage: "url('/images/accessories-banner.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 p-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Apple Accessories
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Complete your setup with stylish and functional Apple accessories.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-gray-500 text-lg animate-pulse">
          Loading accessories...
        </p>
      ) : accessories.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">
            No Accessories Available
          </h2>
          <p className="text-gray-500">
            Currently no accessories are listed.
          </p>
        </div>
      ) : (
        // Products Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4">

          {accessories.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl shadow-lg p-6 hover:scale-105 transition"
            >
              <div className="w-full h-60 overflow-hidden rounded-2xl mb-4">
                <img
                  src={getImageUrl(product)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-semibold text-xl text-gray-800 mb-2">
                {product.name}
              </h3>

              <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                {product.description}
              </p>

              <p className="text-blue-600 font-bold text-lg">
                Rs. {product.price}
              </p>
            </div>
          ))}

        </div>
      )}
    </section>
  );
};

export default Accessories;