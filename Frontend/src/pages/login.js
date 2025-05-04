import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { login } from "../services/apiAuth.js";
import ZuniLogo from "../assets/ZUNI.svg";
import UIT from "../assets/UIT.svg";
import BackgroundImage from "../assets/bgImage.jpg";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/slices/userSlice.js";
import Swal from "sweetalert2";

function Login() {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for existing session
    const checkSession = () => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = Cookies.get("refresh_token");

      if (accessToken && refreshToken) {
        try {
          // Decode access token to get user info
          const decodedToken = jwtDecode(accessToken);
          const userRole = decodedToken.role;

          // Redirect based on role
          switch (userRole) {
            case "ISSUER":
              window.location.href = "/info-issuer";
              break;
            case "HOLDER":
              window.location.href = "/info-holder";
              break;
            case "VERIFIER":
              window.location.href = "/info-verifier";
              break;
            default:
              // If role is not recognized, clear tokens
              localStorage.removeItem("access_token");
              Cookies.remove("refresh_token");
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          // Clear invalid tokens
          localStorage.removeItem("access_token");
          Cookies.remove("refresh_token");
        }
      }
    };

    checkSession();
  }, []);

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setError(null);

      // Validate input
      if (!userId || !password) {
        await Swal.fire({
          title: "Error!",
          text: "Please enter both user ID and password",
          icon: "warning",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#014AC6",
        });
        return;
      }

      const response = await login(userId, password);
      console.log("Login response:", response);
      if (response.status === "SUCCESS") {
        // Lưu Access Token
        if (response.data?.access_token) {
          localStorage.setItem("access_token", response.data.access_token);

          // Hiển thị thông báo thành công
          // await Swal.fire({
          //   title: "Success!",
          //   text: "Login successful!",
          //   icon: "success",
          //   confirmButtonText: "Continue",
          //   confirmButtonColor: "#014AC6",
          // });

          // Chuyển hướng dựa vào role
          if (response.data.role === "ISSUER") {
            window.location.href = "/info-issuer";
          }
          if (response.data.role === "HOLDER") {
            window.location.href = "/info-holder";
          }
          if (response.data.role === "VERIFIER") {
            window.location.href = "/info-verifier";
          }
        }

        // Lưu Refresh Token vào Cookie
        const decoded = jwtDecode(response.data.refresh_token);
        const expiryDate = new Date(decoded.exp * 1000);
        Cookies.set("refresh_token", response.data.refresh_token, {
          expires: expiryDate,
          secure: true,
          sameSite: "Strict",
        });

        dispatch(
          updateUser({
            ...response?.data,
          })
        );
      } else {
        if (response.status === "ERROR") {
          const errorMessage = response.message;
          console.log("Error message:", errorMessage);

          switch (errorMessage) {
            case "User not found":
              await Swal.fire({
                title: "Error!",
                text: "Account does not exist. Please check your User ID",
                icon: "error",
                confirmButtonText: "Try Again",
                confirmButtonColor: "#014AC6",
              });
              break;
            case "Invalid password":
              await Swal.fire({
                title: "Error!",
                text: "Incorrect password. Please try again",
                icon: "error",
                confirmButtonText: "Try Again",
                confirmButtonColor: "#014AC6",
              });
              break;
            default:
              await Swal.fire({
                title: "Error!",
                text: errorMessage || "An error occurred during login",
                icon: "error",
                confirmButtonText: "Try Again",
                confirmButtonColor: "#014AC6",
              });
          }
        } else {
          await Swal.fire({
            title: "Error!",
            text: "An error occurred during login. Please try again later",
            icon: "error",
            confirmButtonText: "Try Again",
            confirmButtonColor: "#014AC6",
          });
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      await Swal.fire({
        title: "Error!",
        text: "An error occurred during login. Please try again later",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#014AC6",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/signup"); // Chuyển đến trang signin
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
