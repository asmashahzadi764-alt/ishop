import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Products from "../components/Products";
import Contact from "../components/Contact";

const Home = () => {
  return (
    <div className="w-full overflow-hidden">

      {/* ⭐ HERO SECTION */}
      <section id="hero">
        <Hero />
      </section>

      {/* ⭐ ABOUT SECTION */}
      <section id="about">
        <About />
      </section>

      {/* ⭐ PRODUCTS SECTION */}
      <section id="products">
        <Products />
      </section>

      {/* ⭐ CONTACT SECTION */}
      <section id="contact">
        <Contact />
      </section>

    </div>
  );
};

export default Home;
