import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ZuniLogo from "../assets/ZUNI.svg";

const HomeHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-20 py-4 bg-[#00040c] shadow">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src={ZuniLogo}
          alt="Zuni Logo"
          className="h-10 w-10 md:h-12 md:w-12"
        />
        <span className="text-white text-xl md:text-2xl font-bold">Zuni</span>
      </div>

      <nav className="hidden md:flex gap-8 text-white text-lg font-medium">
        <a
          onClick={() => navigate("/features")}
          className="hover:text-[#0178c6] transition cursor-pointer"
        >
          Features
        </a>
        <a
          onClick={() => navigate("/about")}
          className="hover:text-[#0178c6] transition cursor-pointer"
        >
          About
        </a>
        <a
          onClick={() => navigate("/contact")}
          className="hover:text-[#0178c6] transition cursor-pointer"
        >
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
        <button onClick={toggleMenu} className="text-white focus:outline-none">
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
    </header>
  );
};

export default HomeHeader;
