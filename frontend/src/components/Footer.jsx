import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaTiktok,
} from "react-icons/fa";
import { motion } from "framer-motion";
import bgImage from "../assets/footer-bg.jpg";

const Footer = () => {
  // Scroll to section function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer
      className="relative text-white py-16 bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 z-10"
      >
        {/* iShop Info */}
        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }}>
          <h2 className="text-3xl font-bold text-white mb-4">iShop</h2>
          <p className="text-gray-200 mb-3">
            Your one stop solution for all kinds of new and used Apple products.
          </p>
          <p className="text-gray-200 text-sm leading-relaxed">
            Complete range of iPhone, iPad, Airpods, Macbook, Apple Watches, and Apple phone cases. <br />
            Wide range of New and Used iPhones.
          </p>

          {/* Social Links */}
          <div className="flex space-x-4 mt-5">
            <motion.a
              href="https://facebook.com/profile.php?id=61577627454545"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 transition-transform duration-300 text-3xl"
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              <FaFacebookF />
            </motion.a>
            <motion.a
              href="https://instagram.com/ishopbyalifarooqui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 transition-transform duration-300 text-3xl"
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              <FaInstagram />
            </motion.a>
            <motion.a
              href="https://youtube.com/@Ishopbyalifarooqi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 transition-transform duration-300 text-3xl"
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              <FaYoutube />
            </motion.a>
            <motion.a
              href="https://tiktok.com/@ishopbyalifarooqi?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 transition-transform duration-300 text-3xl"
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              <FaTiktok />
            </motion.a>
          </div>
        </motion.div>

        {/* Main Links */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <h3 className="text-xl font-semibold text-white mb-4">Main Links</h3>
          <ul className="space-y-2 text-gray-200">
            {[
              { name: "Home", id: "home" },
              { name: "About Us", id: "about" },
              { name: "Products", id: "products" },
              { name: "Reviews", id: "reviews" },
              { name: "Contact Us", id: "contact" },
            ].map((link, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 5, color: "#3B82F6" }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => scrollToSection(link.id)}
                  className="hover:text-blue-500 text-left w-full"
                >
                  {link.name}
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Products */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <h3 className="text-xl font-semibold text-white mb-4">Products</h3>
          <ul className="space-y-2 text-gray-200">
            {[
              "Apple Watches",
              "Accessories",
              "iPhone",
              "iPad",
              "Macbook",
              "TV & Home",
              "Airpods",
              "Entertainment",
            ].map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 5, color: "#3B82F6" }}
                transition={{ duration: 0.2 }}
              >
                <a href="/" className="hover:text-blue-500">
                  {item}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
          <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
          <div className="text-gray-200 mb-3 flex items-start gap-3">
            <FaPhoneAlt className="text-blue-500 text-3xl mt-1" />
            <div className="flex flex-col leading-relaxed text-lg">
              <span>+92-304-8399105</span>
              <span>+92-306-8399990</span>
            </div>
          </div>

          <div className="text-gray-200 flex items-start gap-3">
            <FaMapMarkerAlt className="text-blue-500 text-3xl mt-1" />
            <span>
              Shop #4, Adjacent to Soneri Bank Saddar Cantt, <br />
              Hyderabad (SINDH), Pakistan
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Developer Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative mt-8 border-t border-blue-700 pt-6 text-center text-sm text-gray-300 z-10"
      >
        <h3 className="text-lg font-semibold text-blue-400 mb-2">Developed By</h3>

        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-semibold text-white">Asma Shahzadi</span> — 
            <a
              href="https://www.linkedin.com/in/asma-shahzadi-313291376/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 ml-1 hover:underline"
            >
              LinkedIn
            </a>
            <br />
            Email: 
            <a
              href="mailto:asmashahzadi764@gmail.com"
              className="text-blue-400 hover:underline ml-1"
            >
              asmashahzadi764@gmail.com
            </a>
          </p>
          
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
