import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

import ZuniLogo from "../assets/ZUNI.svg";
import BackgroundImage from "../assets/bgImage.jpg";
import CertificateDiagram from "../assets/vc.svg";
import Certificate from "../assets/certificate.svg";
import Employee from "../assets/employee.svg";
import Protect from "../assets/protect.svg";
import HomeHeader from "../components/HomeHeader.js";
import Footer from "../components/Footer.js";

function Home() {
  const navigate = useNavigate();

  const introduction = [
    {
      title: "Welcome to Zuni!",
      text: "A Blockchain-Enabled Platform for Privacy-Preserving Electronic Certification. Zuni leverages cutting-edge blockchain technology to revolutionize the way credentials are issued, verified, and shared.",
      image: ZuniLogo,
      reverse: true,
    },
    {
      title: "The future of electronic credentials",
      text: "Zuni creates a tamper-proof, decentralized ledger of verified credentials that can be accessed securely and conveniently by both students and employers. Say goodbye to paper certificates and embrace a digital, eco-friendly solution.",
      image: Certificate,
    },
    {
      title: "Helping employers make confident decisions",
      text: "Employers can quickly and confidently verify the credentials of potential hires, reducing fraud and increasing trust in the hiring process. Zuni ensures that every credential is authentic and traceable.",
      image: Employee,
      reverse: true,
    },
    {
      title: "The power of ZKPs in protecting student data",
      text: "Zero-Knowledge Proofs ensure that sensitive information is never disclosed unnecessarily, preserving privacy and security of students' personal data. Zuni empowers users with full control over their information.",
      image: Protect,
    },
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-white text-white font-sans pt-16">
      {/* Header */}
      {/* <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-20 py-4 bg-[#00040c] shadow">
        <div className="flex items-center gap-2">
          <img
            src={ZuniLogo}
            alt="Zuni Logo"
            className="h-10 w-10 md:h-12 md:w-12"
          />
          <span className="text-white text-xl md:text-2xl font-bold">Zuni</span>
        </div>

      
        <nav className="hidden md:flex gap-8 text-white text-lg font-medium">
          <a href="features" className="hover:text-[#0178c6] transition">
            Features
          </a>
          <a href="about" className="hover:text-[#0178c6] transition">
            About
          </a>
          <a href="contact" className="hover:text-[#0178c6] transition">
            Contact
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            className="px-4 py-1 text-white rounded-full border border-white hover:bg-white hover:text-[#014AC6] transition"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

    
        <div className="md:hidden">
          <button
            onClick={toggleMenu} // Toggle menu visibility on click
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

     
        {isMenuOpen && (
          <div className="md:hidden bg-[#1A1C22] text-white mt-16 p-6 absolute top-0 left-0 w-full z-40">
            <nav className="flex flex-col gap-4">
              <a href="features" className="hover:text-[#0178c6] transition">
                Features
              </a>
              <a href="about" className="hover:text-[#0178c6] transition">
                About
              </a>
              <a href="contact" className="hover:text-[#0178c6] transition">
                Contact
              </a>
              <button className="px-4 py-1 text-white rounded-full border border-white hover:bg-white hover:text-[#014AC6] transition">
                Login
              </button>
            </nav>
          </div>
        )}
      </header> */}
      <HomeHeader />

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
            Fast and Secure Certificate Verification with Blockchain &
            Zero-Knowledge Proofs (ZKPs)
          </h1>
          <p className="text-sm mt-4 text-gray-300">
            A system that verifies degrees and certificates without revealing
            sensitive personal information – transparent, secure, and
            decentralized.
          </p>
          <button
            className="mt-6 px-6 py-2 bg-gradient-to-r from-[#014AC6] to-[#0178c6] hover:brightness-110 text-white font-semibold rounded-full shadow-lg transition-all duration-300"
            onClick={() => navigate("/login")}
          >
            GET STARTED
          </button>
        </div>

        <div
          className="relative mt-10 md:mt-0 md:ml-8 z-10 p-4 rounded-lg"
          data-aos="zoom-in"
        >
          <img
            src={CertificateDiagram}
            alt="Certificate Diagram"
            className="w-full max-w-[500px] h-auto hover:scale-105 transition duration-300"
          />
        </div>
      </section>

      <section
        id="features"
        className="bg-gradient-to-b from-[#F9FAFB] to-[#e5ecf4] text-gray-800 py-20 px-4 md:px-28 space-y-28"
      >
        {introduction.map((section, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              section.reverse ? "md:flex-row-reverse" : "md:flex-row"
            } items-center gap-10`}
            data-aos="fade-up"
          >
            <div className="md:w-1/2">
              <img
                src={section.image}
                alt={section.title}
                className="w-40 h-40 md:w-60 md:h-60 max-w-md mx-auto hover:scale-105 transition duration-300"
              />
            </div>
            <div className="md:w-1/2 bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition duration-300">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#014AC6] flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-[#014AC6]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.476 2 2 6.486 2 12c0 5.522 4.476 10 10 10s10-4.478 10-10c0-5.514-4.476-10-10-10zm0 18a7.963 7.963 0 01-5.656-2.344A7.963 7.963 0 014 12c0-2.136.834-4.142 2.344-5.656A7.963 7.963 0 0112 4c2.136 0 4.142.834 5.656 2.344A7.963 7.963 0 0120 12c0 2.136-.834 4.142-2.344 5.656A7.963 7.963 0 0112 20z" />
                </svg>
                {section.title}
              </h2>
              <p className="text-base md:text-lg leading-relaxed">
                {section.text}
              </p>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}

export default Home;
