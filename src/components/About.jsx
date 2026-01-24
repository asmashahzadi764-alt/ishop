// src/components/About.jsx
import React from "react";
import aboutImage from "../assets/about-image.jpg"; // make sure you have an image

function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:flex md:items-center md:gap-12">
        {/* Image */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img
            src={aboutImage}
            alt="About iShop"
            className="rounded-xl shadow-lg w-full object-cover"
          />
        </div>

        {/* Text content */}
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Pakistan’s Leading Apple Store
          </h2>
          <p className="text-gray-600 mb-6">
            iShop is an independent Apple specialist retailer in Pakistan. Our staff are all Apple enthusiasts with a passion for Mac, iPad, iPhone, and all latest Apple products. We provide advice, training, and ongoing support to all our customers.
          </p>

          {/* Features with icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 text-2xl">🚚</span>
              <p className="text-gray-700">
                Delivery all over Pakistan .
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 text-2xl">💬</span>
              <p className="text-gray-700">
                Excellent customer support via WhatsApp, Messenger, Call, Text, and Email.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 text-2xl">💰</span>
              <p className="text-gray-700">
                Best rates in the market - our prices beat all competitors.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 text-2xl">⚙️</span>
              <p className="text-gray-700">
                Market-leading technology and expert guidance on all Apple products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
