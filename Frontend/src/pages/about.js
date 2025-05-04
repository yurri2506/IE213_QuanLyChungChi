import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

import BackgroundImage from "../assets/bgImage.jpg";
import ZUNILogo from "../assets/ZUNI.svg";
import HomeHeader from "../components/HomeHeader.js";
import Footer from "../components/Footer.js";

function About() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-white text-white font-sans pt-16">
      {/* Header */}
      <HomeHeader />

      {/* Hero Section */}
      <section className="relative px-4 md:px-28 py-24 md:flex items-center justify-between overflow-hidden min-h-[80vh]">
        <img
          src={BackgroundImage}
          alt="Background"
          className="absolute inset-0 w-full h-[80vh] object-cover opacity-75 z-0"
          data-aos="fade-down"
        />
        <div
          className="absolute inset-0 h-[80vh] bg-black/60 z-0"
          data-aos="fade-down"
        ></div>

        <div className="relative max-w-xl z-10" data-aos="fade-right">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Learn More About Zuni
          </h1>
          <p className="text-sm mt-4 text-gray-300">
            Discover how Zuni is transforming the way educational credentials
            are verified through blockchain and Zero-Knowledge Proofs (ZKPs).
          </p>
          <button
            className="mt-6 px-6 py-2 bg-gradient-to-r from-[#014AC6] to-[#0178c6] hover:brightness-110 text-white font-semibold rounded-full shadow-lg transition-all duration-300"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </button>
        </div>

        <div
          className="relative mt-10 md:mt-0 md:ml-8 z-10 p-4 rounded-lg"
          data-aos="zoom-in"
        >
          <img
            src={ZUNILogo}
            alt="Our Team"
            className="w-full max-w-[500px] h-auto hover:scale-105 transition duration-300"
          />
        </div>
      </section>

      {/* About Content */}
      <section
        id="about"
        className="bg-gradient-to-b from-[#F9FAFB] to-[#e5ecf4] text-gray-800 py-20 px-4 md:px-28 space-y-28"
      >
        <div className="flex flex-col items-center gap-10" data-aos="fade-up">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#014AC6] mb-4 text-center">
            Our Mission
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-center max-w-3xl mx-auto">
            At Zuni, we are committed to providing a secure, efficient, and
            privacy-preserving way of verifying academic credentials. By
            leveraging blockchain technology and Zero-Knowledge Proofs (ZKPs),
            we ensure that students’ sensitive data is protected while giving
            employers the confidence to trust the credentials of potential
            hires.
          </p>
        </div>

        <div
          className="flex flex-col md:flex-row items-stretch gap-10"
          data-aos="fade-up"
        >
          <div className="md:w-1/2 bg-white shadow-lg rounded-xl p-6 h-full flex flex-col justify-between">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#014AC6]">
              Transparency and Trust
            </h3>
            <p className="text-base md:text-lg leading-relaxed">
              Zuni creates a decentralized, tamper-proof ledger of verified credentials, ensuring that all information is authentic and easily accessible for both students and employers. We aim to eliminate fraud and make the credential verification process more efficient and trustworthy.
            </p>
          </div>
          
          <div className="md:w-1/2 bg-white shadow-lg rounded-xl p-6 h-full flex flex-col justify-between">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#014AC6]">
              Privacy and Security
            </h3>
            <p className="text-base md:text-lg leading-relaxed">
              We prioritize the security and privacy of our users. Zero-Knowledge Proofs ensure that personal data is never shared unless necessary. Zuni empowers students to maintain control over their credentials while protecting their sensitive information.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-10" data-aos="fade-up">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#014AC6] mb-4 text-center">
            Join the Zuni Revolution
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-center max-w-3xl mx-auto">
            Zuni is transforming the educational credential landscape by
            enabling verified certificates that are both secure and
            environmentally friendly. Join us as we create a future where
            credentials are accessible, verifiable, and protected by the latest
            in blockchain and cryptographic technologies.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default About;
