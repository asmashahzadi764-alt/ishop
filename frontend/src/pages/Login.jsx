import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Image / Branding */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-blue-500 to-indigo-600 text-white p-12 relative">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-4 tracking-wide">iShop</h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            Discover the latest mobile phones, accessories, and gadgets —
            <br />
            all in one place. Stay trendy with iShop 💙
          </p>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-10 left-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center bg-gray-50">
        <div className="bg-white/90 backdrop-blur-lg shadow-xl border border-gray-200 rounded-3xl p-10 w-full max-w-md mx-6 transition-all duration-300 hover:shadow-blue-100">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-3">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Sign in to continue your shopping experience
          </p>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="flex justify-between items-center">
              <Link
                to="#"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition duration-300"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-gray-600 mt-8 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
