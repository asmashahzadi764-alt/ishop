import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <img
        src={product.image}
        alt={product.name}
        className="h-60 w-60 object-cover rounded mb-4"
      />
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Price:</strong> Rs {product.price}</p>
      <p className="mt-2"><strong>Description:</strong> {product.description}</p>

      <Link
        to="/admin/manage-products"
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        🔙 Back to Manage Products
      </Link>
    </div>
  );
}

export default ViewProduct;
