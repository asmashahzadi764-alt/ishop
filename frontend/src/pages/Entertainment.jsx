import React, { useEffect, useState } from "react";

const Entertainment = () => {
  const [entertainmentProducts, setEntertainmentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntertainment = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/products");
        const data = await response.json();

        const filtered = data.filter(
          (p) =>
            p.category && p.category.toLowerCase().trim() === "entertainment"
        );
        setEntertainmentProducts(filtered);
      } catch (error) {
        console.error("Error fetching entertainment products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntertainment();
  }, []);

  // ✅ Helper function to handle URL or uploaded file
  const getImageUrl = (product) => {
    if (!product.image && !product.imageFile) return "/images/placeholder.png"; // fallback
    if (product.image && product.image.startsWith("http")) return product.image;
    if (product.imageFile) return `http://localhost:5001${product.imageFile}`;
    return `http://localhost:5001${product.image}`;
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-16">
      {/* Banner */}
      <div
        className="w-full bg-cover bg-center rounded-3xl overflow-hidden shadow-lg relative mb-12"
        style={{ backgroundImage: "url('/images/entertainment-banner.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 p-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            Entertainment Zone
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow">
            Immerse yourself in the world of Apple Music, TV, and gaming.
          </p>
        </div>
      </div>

      {/* Loading / Empty State */}
      {loading ? (
        <p className="text-gray-500 text-lg animate-pulse mb-10">
          Loading entertainment products...
        </p>
      ) : entertainmentProducts.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">
            No Entertainment Products Available
          </h2>
          <p className="text-gray-500">
            No entertainment products are listed yet. Please check again later.
          </p>
        </div>
      ) : (
        // Products Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4">
          {entertainmentProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl shadow-lg p-6 transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
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

export default Entertainment;
