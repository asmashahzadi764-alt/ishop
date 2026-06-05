import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const products = [
    { name: "iPhone", path: "/iphone" },
    { name: "iPad", path: "/ipad" },
    { name: "AirPods", path: "/airpods" },
    { name: "Macbook", path: "/macbook" },
    { name: "Apple Watch", path: "/applewatch" },
    { name: "iMac", path: "/imac" },
    { name: "Apple TV", path: "/appletv" },
    { name: "Entertainment", path: "/entertainment" },
    { name: "Accessories", path: "/accessories" },
  ];

  // Scroll to top (Home)
  const scrollToTop = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Scroll to any section
  const handleNavClick = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Close dropdown on outside click (Desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50 border-b-2 border-blue-100">
      <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={scrollToTop}>
          <img src={logo} alt="iShop Logo" className="w-12 h-12 rounded-full shadow-md" />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700">iShop</h1>
            <p className="text-sm text-blue-500 -mt-1 font-medium">by Ali Farooqi</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-10 font-semibold text-lg text-blue-700">
          <li>
            <button onClick={scrollToTop} className="hover:text-blue-900 transition duration-200">Home</button>
          </li>

          {/* Products Dropdown */}
          <li ref={dropdownRef} className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center hover:text-blue-900 transition duration-200">
              Products
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute left-0 top-10 w-56 bg-white border border-blue-100 rounded-lg shadow-lg text-blue-700">
                {products.map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="block px-5 py-2 hover:bg-blue-50 hover:text-blue-900"
                      onClick={() => setIsDropdownOpen(false)}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <button onClick={() => handleNavClick("about")} className="hover:text-blue-900 transition duration-200">About</button>
          </li>
          <li>
            <button onClick={() => handleNavClick("contact")} className="hover:text-blue-900 transition duration-200">Contact</button>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-blue-700 focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-blue-100 shadow-md text-blue-700 font-semibold">
          <ul className="flex flex-col w-full py-4 space-y-2 items-stretch">
            <li>
              <button
                onClick={scrollToTop}
                className="w-full text-left px-6 py-3 hover:bg-blue-50 hover:text-blue-900 transition duration-200"
              >
                Home
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick("products")}
                className="w-full text-left px-6 py-3 hover:bg-blue-50 hover:text-blue-900 transition duration-200"
              >
                Products
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick("about")}
                className="w-full text-left px-6 py-3 hover:bg-blue-50 hover:text-blue-900 transition duration-200"
              >
                About
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick("contact")}
                className="w-full text-left px-6 py-3 hover:bg-blue-50 hover:text-blue-900 transition duration-200"
              >
                Contact
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
