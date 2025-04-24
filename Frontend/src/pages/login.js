import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { login } from "../services/apiAuth.js";
import ZuniLogo from "../assets/ZUNI.svg";
import UIT from "../assets/UIT.svg";
import BackgroundImage from "../assets/bgImage.jpg";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userId, setUserId] = useState("UIT");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await login(userId, password);
      if (response) {
        // Handle successful login (e.g., redirect to dashboard)
        console.log("Login response:", response);
        const token = response.data.access_token;
        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("name", response.data.name);
        if (response.data.role === "ISSUER") {
          localStorage.setItem(
            "encrypted_private_key",
            response.data.encrypted_private_key
          );
          localStorage.setItem("salt", response.data.salt);
          localStorage.setItem("iv", response.data.iv);
          localStorage.setItem("registed_DID", response.data.registed_DID);
          window.location.href = "/info-issuer";
        }
        if (response.data.role === "HOLDER") {
          window.location.href = "/info-holder";
        }
        if (response.data.role === "VERIFIER") {
          window.location.href = "/info-verifier";
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/signin"); // Chuyển đến trang signin
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side */}
      <div
        className="w-full md:w-[40%] flex flex-col justify-center items-center px-6 py-12 bg-white z-10"
        data-aos="fade-right"
      >
        <div className="max-w-md w-full text-center">
          <img
            src={ZuniLogo}
            alt="icon"
            className="w-24 h-24 mx-auto mb-6 hover:scale-110 transition duration-300"
          />
          <h2 className="text-2xl font-bold mb-2 text-[#014AC6]">
            Welcome back!
          </h2>
          <p className="mb-2 text-gray-600">Log in to access your dashboard.</p>
          <p className="mb-6 font-semibold text-gray-800">
            Issuer / Holder / Verifier
          </p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="User id"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#014AC6]"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#014AC6]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex flex-col items-center mt-4 border-t border-gray-300 pt-4 space-y-3">
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-all duration-300"
                onClick={handleLogin}
              >
                Log in
              </button>
              <button
                type="button"
                className="text-sm text-[#014AC6] hover:underline transition duration-300"
              >
                Forgot password?
              </button>
              <button
                type="button"
                className="text-sm text-[#014AC6] hover:underline transition duration-300"
                onClick={handleClick}
              >
                Register for an account
              </button>
            </div>
          </form>

          <div className="mt-6 text-gray-600 w-full text-start">
            <a
              href="/"
              className="mt-6 text-left text-gray-600 hover:text-[#014AC6] underline  "
            >
              ⬅ Go back home
            </a>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div
        className="hidden md:flex w-[60%] relative items-center justify-center text-white"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-aos="fade-left"
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div
          className="relative p-10 rounded-lg text-center max-w-2xl"
          data-aos="zoom-in"
        >
          <h3 className="text-3xl font-bold mb-4">Welcome to Our Platform</h3>
          <p className="text-lg mb-6">
            Empowering universities, corporations, and individuals with secure
            and modern certificate management.
          </p>
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4">University</h3>
            <div className="flex justify-center gap-6">
              <img
                src={UIT}
                alt="UIT"
                className="h-28 hover:scale-105 transition duration-300"
              />
            </div>
          </div>
          {/* <div>
            <h3 className="text-xl font-bold mb-4">Corporations</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              <img src="/fpt.png" alt="FPT" className="h-12" />
              <img src="/vinai.png" alt="VinAI" className="h-12" />
              <img src="/viettel.png" alt="Viettel" className="h-12" />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
