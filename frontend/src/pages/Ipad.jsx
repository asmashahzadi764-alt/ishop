import React, { useEffect, useState } from "react";

const API =
  import.meta.env.VITE_API_URL ||
  "https://ishop-backend-a0gx.onrender.com";

const Ipad = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);

        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching iPad products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // filter iPads
  const ipadProducts = products.filter(
    (p) =>
      p.category &&
      p.category.toLowerCase().trim() === "ipad"
  );

  // safe image handler
  const getImageUrl = (product) => {
    if (!product?.image && !product?.imageFile)
      return "/images/placeholder.png";

    if (product.image?.startsWith("http"))
      return product.image;

    if (product.imageFile)
      return `${API}${product.imageFile}`;

    return `${API}${product.image}`;
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-16">

      {/* Banner */}
      <div
        className="w-full bg-cover bg-center rounded-3xl overflow-hidden shadow-lg mb-12"
        style={{ backgroundImage: "url('/images/ipad-banner.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 p-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            iPad Series
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Enjoy creativity and performance — your perfect tablet for work and play.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-gray-500 text-lg animate-pulse mb-10">
          Loading iPad products...
        </p>
      ) : ipadProducts.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No iPad Products Available
          </h2>
          <p className="text-gray-500">
            Currently, no iPad products are listed. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4">

          {ipadProducts.map((product) => (
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

export default Ipad;