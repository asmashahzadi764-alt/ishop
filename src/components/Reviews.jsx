import React from "react";

const reviews = [
  {
    name: "Ayesha Khan",
    text: "Absolutely love iShop! I got my iPhone 17 Pro here — original, fast delivery, and great support!",
  },
  {
    name: "Ali Raza",
    text: "Superb customer service! They even helped me choose between a MacBook Air and Pro. Highly recommend!",
  },
  {
    name: "Sara Ahmed",
    text: "Smooth shopping experience and 100% authentic Apple products. I’m impressed!",
  },
];

const Reviews = () => {
  return (
    <section id="reviews" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          What Our Customers Say ❤️
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
            >
              <p className="text-gray-600 italic mb-4">“{review.text}”</p>
              <h3 className="font-semibold text-blue-600">{review.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
