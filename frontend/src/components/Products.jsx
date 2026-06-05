import React from "react";
import { Link } from "react-router-dom";

const products = [
  { name: "iPhone", image: "/images/iphone.jpg", link: "/iphone" },
  { name: "iPad", image: "/images/ipad.jpg", link: "/ipad" },
  { name: "Airpods", image: "/images/airpods.jpg", link: "/airpods" },
  { name: "Macbook", image: "/images/macbook.jpg", link: "/macbook" },
  { name: "Apple Watch", image: "/images/applewatch.jpg", link: "/applewatch" },
  { name: "iMac", image: "/images/imac.jpg", link: "/imac" },
  { name: "Apple TV", image: "/images/appletv.jpg", link: "/appletv" },
  { name: "Entertainment", image: "/images/entertainment.jpg", link: "/entertainment" },
  { name: "Accessories", image: "/images/accessories.jpg", link: "/accessories" },
];

const Products = () => {
  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="text-center mb-16 px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Products & Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Complete range of iPhone, iPad, Airpods, Macbook, Apple Watches,
          Apple TV, and Accessories — explore the best from Apple.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {products.map((product, index) => (
          <Link
            key={index}
            to={product.link}
            className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-72 object-cover rounded-t-xl transition-transform duration-300 hover:scale-105"
            />
            <h3 className="text-xl font-semibold text-gray-800 mt-4 px-4 py-2">{product.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Products;
