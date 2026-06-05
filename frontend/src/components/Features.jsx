import React from "react";
import { Truck, ShieldCheck, Headphones } from "lucide-react";

const features = [
  {
    icon: <Truck className="w-10 h-10 text-blue-500" />,
    title: "Fast  Delivery",
    desc: "Get your gadgets delivered across the country in just 2–3 days!",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-blue-500" />,
    title: "Secure Payments",
    desc: "We use advanced encryption to keep your transactions 100% safe.",
  },
  {
    icon: <Headphones className="w-10 h-10 text-blue-500" />,
    title: "24/7 Customer Support",
    desc: "Got a question? Our tech experts are always here to help you.",
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-gray-50" id="features">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">
          Why Shop With <span className="text-blue-600">iShop?</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

