import React from 'react';
import Nav from "../features/Nav/Nav";
import CTA from "../features/CTA/CTA"
import Hero from "../features/Hero/Hero";
import Footer from "../features/Footer/Footer";

function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <CTA />
      <Footer />
    </>
  );
}

export default LandingPage;
