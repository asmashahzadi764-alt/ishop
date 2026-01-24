import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="mt-24">
      {/* ✅ Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-700 mb-4">
          Welcome to iShop
        </h1>
        <p className="text-lg md:text-xl text-blue-600 mb-6 max-w-2xl">
          Discover the latest Apple products — iPhones, MacBooks, AirPods, and more.
        </p>
        <Link
          to="#products"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("products").scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-blue-700 text-white px-6 py-3 rounded-full hover:bg-blue-800 transition duration-200"
        >
          Explore Products
        </Link>
      </section>

      {/* ✅ Products Section */}
      <section id="products" className="py-20 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-8">
          Our Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700">iPhone</h3>
            <p className="text-blue-500 mt-2">Latest models with amazing features.</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700">MacBook</h3>
            <p className="text-blue-500 mt-2">Powerful performance for professionals.</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700">AirPods</h3>
            <p className="text-blue-500 mt-2">Wireless freedom and premium sound.</p>
          </div>
        </div>
      </section>

      {/* ✅ About Section */}
      <section id="about" className="py-20 bg-blue-50 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">About Us</h2>
        <p className="text-blue-600 max-w-3xl mx-auto text-lg">
          iShop is your trusted Apple product destination. We bring you authentic, latest, and
          high-quality devices directly from Apple with guaranteed support and after-sales service.
        </p>
      </section>

      {/* ✅ Contact Section */}
      <section id="contact" className="py-20 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">Contact Us</h2>
        <p className="text-blue-600 max-w-3xl mx-auto text-lg mb-6">
          Have questions? Reach out to us through the form below.
        </p>
        <form className="max-w-lg mx-auto space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <textarea
            placeholder="Your Message"
            className="w-full border border-blue-200 rounded-lg px-4 py-2 h-32 focus:ring-2 focus:ring-blue-400 outline-none"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-3 rounded-full hover:bg-blue-800 transition duration-200"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};

export default Home;
