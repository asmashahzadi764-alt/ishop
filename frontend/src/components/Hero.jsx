import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import heroImage from "../assets/hero.jpg";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden min-h-[500px] md:h-screen">

      {/* 🔹 Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* 🔹 Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* 🔹 Desktop Content */}
      <div className="hidden md:flex relative z-10 flex-col justify-center h-full px-6 md:pl-20 lg:pl-32 max-w-lg py-20">

        <h1 className="text-6xl font-extrabold mb-4 text-white drop-shadow-lg leading-tight">
          iShop
        </h1>

        <p className="text-lg text-white mb-6 drop-shadow-md leading-relaxed">
          Your one stop solution for all kinds of new and used Apple products.
          Discover the best deals on your favorite gadgets and accessories!
        </p>

        {/* Desktop Buttons */}
        <div className="flex flex-col space-y-3 w-full max-w-xs md:max-w-sm">
          <a
            href="tel:+923068399990"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold text-center transition-all duration-300 hover:scale-105 shadow-md"
          >
            <FaPhoneAlt className="text-white text-lg" />
            +92 306 8399990
          </a>

          <a
            href="tel:+923048399105"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold text-center transition-all duration-300 hover:scale-105 shadow-md"
          >
            <FaPhoneAlt className="text-white text-lg" />
            +92 304 8399105
          </a>
        </div>
      </div>

      {/* 🔹 Mobile Buttons → Bottom-Left */}
      <div className="md:hidden absolute bottom-20 left-4 z-20 flex flex-col space-y-2 w-[70%]">
        <a
          href="tel:+923068399990"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold text-sm shadow-md"
        >
          <FaPhoneAlt className="text-white text-base" />
          +92 306 8399990
        </a>

        <a
          href="tel:+923048399105"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold text-sm shadow-md"
        >
          <FaPhoneAlt className="text-white text-base" />
          +92 304 8399105
        </a>
      </div>

      {/* 🔹 Wave (Desktop + Mobile) */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 150"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#ffffff"
          d="M0,64 C360,192 1080,0 1440,128 L1440,150 L0,150 Z"
        ></path>
      </svg>
    </section>
  );
};

export default Hero;
