import React from "react";
import HomeHeader from "../components/HomeHeader.js";
import ZuniLogo from "../assets/ZUNI.svg";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.js";

export default function Features() {
  const navigate = useNavigate();
  const features = [
    {
      title: "Easy Certificate Creation",
      description: "Simple interface for organizations to create certificates in minutes.",
      icon: "📄",
    },
    {
      title: "ZK Verification (ZKP)",
      description: "Uses Zero-Knowledge Proof for validation.",
      icon: "🔐",
    },
    {
      title: "Encryption & Security",
      description: "Certificates are protected with modern encryption.",
      icon: "🛡️",
    },
    {
      title: "Certificate Sharing",
      description: "Easily share via URL or QR code.",
      icon: "🔗",
    },
    {
      title: "Tracking & Management",
      description: "Manage issued certificates, revoke or update with ease.",
      icon: "📊",
    },
    {
      title: "API Integration",
      description: "Supports REST API / GraphQL for system integration.",
      icon: "🧩",
    },
  ];

  const advantages = [
    { title: "Privacy Protection", desc: "Verify without revealing sensitive personal data." },
    { title: "No Blockchain Knowledge Required", desc: "Designed for non-technical users." },
    { title: "Access Grant/Revocation", desc: "Full control over certificate access." },
    { title: "User-Owned Credentials", desc: "Students own and manage their own data." },
    { title: "QR/Web Verification", desc: "Modern and convenient validation methods." },
    { title: "Flexible Data Sharing", desc: "Share credentials with third parties securely." },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-white font-sans pt-16">
      <HomeHeader />

      <div className="flex text-black flex-col items-center justify-center min-h-screen p-10">
        <h1 className="text-4xl font-bold my-4 text-blue-600" data-aos="fade-up">
          Discover the Power of Zuni
        </h1>
        <p className="text-gray-400 mb-16" data-aos="fade-up">
          A platform to easily create, verify, and manage decentralized academic credentials.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl py-8 px-4 shadow-blue-700 shadow hover:shadow-sm hover:shadow-blue-500 transition text-center bg-white text-black "
              data-aos="fade-up"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl text-blue-600 font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-900 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-32 max-w-5xl mx-auto text-center my-12" data-aos="fade-up">
          <h2 className="text-4xl text-blue-600 font-bold mb-4"> Advantages of Zuni</h2>
          <p className="text-gray-400">
            A decentralized credentialing system using ZKP and DID to protect student privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12" data-aos="fade-up">
          {advantages.map((f, index) => (
            <div
              key={index}
              className="border-l-4 border-blue-700 rounded-xl p-6 shadow-lg flex items-start gap-4"
            >
              <CheckCircle className="text-blue-500 w-6 h-6 mt-1" />
              <div>
                <h3 className="text-xl  font-semibold mb-1">{f.title}</h3>
                <p className="text-gray-400 text-base">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-20 w-full flex h-[80vh]" data-aos="zoom-in">
          {/* Background Logo */}
          <img
            src={ZuniLogo}
            alt="Zuni Logo"
            className="absolute top-0 opacity-10 w-full h-full object-cover"
          />

          <div className="w-full min-h-screen flex flex-col text-center items-center z-10" data-aos="fade-up">
            {/* Main Logo */}
            <img src={ZuniLogo} alt="Zuni Logo" className="h-1/2" />

            <p className="text-black text-3xl font-bold mb-2">Welcome to Zuni</p>
            <p className="text-gray-700 text-lg mb-6">Experience Zuni today</p>

            <button className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
