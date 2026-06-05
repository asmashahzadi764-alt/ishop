import React, { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://ishop-backend-a0gx.onrender.com";

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products`);

        if (!response.ok) {
          throw new Error("API error");
        }

        const data = await response.json();

        const filtered = data.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase().trim() === "accessories"
        );

        setAccessories(filtered);
      } catch (error) {
        console.error("Error fetching accessories:", error);
        setAccessories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  // ✅ Safe image handler (same standard everywhere)
  const getImageUrl = (product) => {
    if (!product) return "/images/placeholder.png";

    if (product.image?.startsWith("http")) {
      return product.image;
    }

    if (product.imageFile) {
      return `${API_BASE}${product.imageFile}`;
    }

    if (product.image) {
      return `${API_BASE}${product.image}`;
    }

    return "/images/placeholder.png";
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
          <h2 className="text-2xl font-semibold text-gray-700">
            No Accessories Available
          </h2>
          <p className="text-gray-500 mt-2">
            Currently no accessories are listed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4">

          {accessories.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl shadow-lg p-6 hover:scale-105 transition"
            >
              <div className="w-full h-60 overflow-hidden rounded-2xl mb-4">
                <img
                  src={getImageUrl(product)}
                  alt={product.name || "product"}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-semibold text-xl text-gray-800">
                {product.name || "No name"}
              </h3>

              <p className="text-gray-500 text-sm mt-1 line-clamp-3">
                {product.description || "No description"}
              </p>

              <p className="text-blue-600 font-bold text-lg mt-2">
                Rs. {product.price ?? 0}
              </p>
            </div>
          ))}

        </div>
      )}
    </section>
  );
};

export default Accessories;