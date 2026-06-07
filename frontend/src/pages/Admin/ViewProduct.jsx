import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "https://ishop-backend-a0gx.onrender.com";

function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `${API}/api/products/${id}`
        );
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getImageUrl = (img) => {
    if (!img) return "/placeholder.png";
    if (img.startsWith("http")) return img;
    return `${API}${img}`;
  };

  if (loading)
    return <p className="p-6 text-gray-600">Loading...</p>;

  if (error)
    return <p className="p-6 text-red-600">{error}</p>;

  if (!product)
    return <p className="p-6">No product found</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">

      <h2 className="text-2xl font-bold mb-4">
        {product.name}
      </h2>

      <img
        src={getImageUrl(product.image)}
        alt={product.name}
        className="h-60 w-full object-cover rounded mb-4"
      />

      <p className="mb-2">
        <strong>Category:</strong> {product.category}
      </p>

      <p className="mb-2">
        <strong>Price:</strong> Rs {product.price}
      </p>

      <p className="mt-2 text-gray-700">
        <strong>Description:</strong><br />
        {product.description}
      </p>

      <Link
        to="/admin/manage-products"
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        🔙 Back
      </Link>
    </div>
  );
}

export default ViewProduct;