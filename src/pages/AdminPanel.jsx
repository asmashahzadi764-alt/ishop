import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import {
  LogOut,
  Package,
  PlusCircle,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";
import axios from "axios";
import Toast from "../components/Toast";

const AdminPanel = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [toast, setToast] = useState({ message: "", color: "" });
  const [productCount, setProductCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("⛔ Unauthorized! Please log in.", "bg-red-500");
      setTimeout(() => navigate("/admin-login"), 1500);
    } else {
      setAdminEmail("admin@ishop.com");
      fetchCounts(token);
    }
  }, [navigate]);

  const showToast = (message, color = "bg-green-500") => {
    setToast({ message, color });
  };

  const fetchCounts = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Use relative path so Vite dev proxy forwards this to the client backend (port 5001)
      const res = await axios.get('/api/admin/counts', config);

      setProductCount(res.data.totalProducts);
      setMessageCount(res.data.totalMessages);
      setAdminCount(res.data.totalAdmins);
    } catch (err) {
      console.error("Error fetching counts:", err);
      showToast("❌ Failed to fetch data!", "bg-red-500");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    showToast("✅ You have been logged out successfully!", "bg-green-500");
    setTimeout(() => navigate("/admin-login"), 1500);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col justify-between shadow-lg">
        <div>
          <div className="px-6 py-5 text-2xl font-bold border-b border-blue-600">
             iShop Admin
          </div>
          <nav className="mt-6 flex flex-col space-y-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition ${
                  isActive ? "bg-blue-600" : "hover:bg-blue-600/70"
                }`
              }
            >
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>

            <NavLink
              to="/admin/manage-products"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition ${
                  isActive ? "bg-blue-600" : "hover:bg-blue-600/70"
                }`
              }
            >
              <Package size={18} /> Manage Products
            </NavLink>

            <NavLink
              to="/admin/add-product"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition ${
                  isActive ? "bg-blue-600" : "hover:bg-blue-600/70"
                }`
              }
            >
              <PlusCircle size={18} /> Add Product
            </NavLink>

            <NavLink
              to="/admin/messages"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition ${
                  isActive ? "bg-blue-600" : "hover:bg-blue-600/70"
                }`
              }
            >
              <MessageSquare size={18} /> Messages
            </NavLink>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 mb-5 text-sm font-medium bg-blue-800 hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
              <span className="block text-blue-700">Hello Ali Farooqi</span>
              <span className="block text-gray-600 text-xl font-medium mt-1">
                Welcome Back!
              </span>
            </h1>
          </div>

          <div className="mt-4 sm:mt-0 text-gray-600 text-sm">
            Logged in as{" "}
            <span className="font-semibold text-blue-700">{adminEmail}</span>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border-l-4 border-blue-600">
            <h2 className="text-sm text-gray-500">Total Products</h2>
            <p className="text-2xl font-bold text-blue-700 mt-1">{productCount}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border-l-4 border-green-500">
            <h2 className="text-sm text-gray-500">Messages</h2>
            <p className="text-2xl font-bold text-green-600 mt-1">{messageCount}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border-l-4 border-yellow-500">
            <h2 className="text-sm text-gray-500">Admins</h2>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{adminCount}</p>
          </div>
        </div>

        <Outlet />
      </main>

      {/* Toast Notification */}
      {toast.message && (
        <Toast
          message={toast.message}
          color={toast.color}
          onClose={() => setToast({ message: "", color: "" })}
        />
      )}
    </div>
  );
};

export default AdminPanel;
