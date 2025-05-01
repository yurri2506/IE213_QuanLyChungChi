import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ZuniLogo from "../../assets/ZUNI.svg";
import UIT from "../../assets/UIT.svg";
import BackgroundImage from "../../assets/bgImage.jpg";
import axios from "axios";
import Swal from "sweetalert2";

function SignUp() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Name field
  const [symbol, setSymbol] = useState(""); // Symbol field
  const [schoolCode, setSchoolCode] = useState(""); // Only for Issuer
  const [role, setRole] = useState("ISSUER"); // Default to "Issuer"
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const getInputClassName = (fieldName) => {
    const baseClass =
      "w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#014AC6] transition-all duration-300";
    return validationErrors[fieldName]
      ? `${baseClass} border-red-500 focus:ring-red-500 bg-red-50`
      : `${baseClass} border-gray-300`;
  };

  const validateForm = () => {
    const errors = {};
    if (password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (role === "ISSUER") {
      if (schoolCode.length !== 3) {
        errors.schoolCode = "Mã trường phải có đúng 3 ký tự";
      } else if (!/^[A-Za-z0-9]+$/.test(schoolCode)) {
        errors.schoolCode = "Mã trường chỉ được chứa chữ cái tiếng Anh và số";
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError(null);

    const API_BASE_URL =
      `${process.env.REACT_APP_API_URL}/auth` ||
      "http://localhost:5001/api/auth";

    const payload =
      role === "ISSUER"
        ? {
            issuer_id: userId,
            password,
            name,
            school_code: schoolCode,
            symbol,
          }
        : {
            verifier_id: userId,
            password,
            name,
            symbol,
          };

    const endpoint = role === "ISSUER" ? "/issuers" : "/verifiers";

    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      console.log("Signup response:", response);

      if (response.data.status === "SUCCESS") {
        // Hiển thị thông báo thành công bằng SweetAlert2
        await Swal.fire({
          title: "Success!",
          text: "Registration successful! Please login to continue.",
          icon: "success",
          confirmButtonText: "Login",
          confirmButtonColor: "#014AC6",
        });
        window.location.href = "/login";
      } else {
        await Swal.fire({
          title: "Error!",
          text: response.data?.message || "Registration failed.",
          icon: "error",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#014AC6",
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      // Xử lý các loại lỗi cụ thể
      if (err.response?.data?.status === "ERROR") {
        const errorMessage = err.response.data.message;
        console.log("Error message:", errorMessage);

        switch (errorMessage) {
          case "User already exists":
            await Swal.fire({
              title: "Error!",
              text: "Account already exists. Please use a different ID.",
              icon: "error",
              confirmButtonText: "Try Again",
              confirmButtonColor: "#014AC6",
            });
            break;
          case "Missing required fields":
            await Swal.fire({
              title: "Error!",
              text: "Please fill in all required fields.",
              icon: "warning",
              confirmButtonText: "Try Again",
              confirmButtonColor: "#014AC6",
            });
            break;
          default:
            await Swal.fire({
              title: "Error!",
              text: errorMessage || "An error occurred during registration.",
              icon: "error",
              confirmButtonText: "Try Again",
              confirmButtonColor: "#014AC6",
            });
        }
      } else {
        await Swal.fire({
          title: "Error!",
          text: "An error occurred during registration. Please try again later.",
          icon: "error",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#014AC6",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side */}
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
            Create an account
          </h2>
          <p className="mb-6 text-gray-600">Sign up as an Issuer / Verifier</p>

          <form className="space-y-4" onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="User ID"
              className={getInputClassName("userId")}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            {validationErrors.userId && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationErrors.userId}
              </div>
            )}
            <input
              type="password"
              placeholder="Password"
              className={getInputClassName("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {validationErrors.password && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationErrors.password}
              </div>
            )}
            <input
              type="text"
              placeholder="Name"
              className={getInputClassName("name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {validationErrors.name && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationErrors.name}
              </div>
            )}
            <input
              type="text"
              placeholder="Symbol"
              className={getInputClassName("symbol")}
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />
            {validationErrors.symbol && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationErrors.symbol}
              </div>
            )}

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={getInputClassName("role")}
            >
              <option value="ISSUER">Issuer</option>
              <option value="VERIFIER">Verifier</option>
            </select>
            {validationErrors.role && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationErrors.role}
              </div>
            )}

            {role === "ISSUER" && (
              <>
                <input
                  type="text"
                  placeholder="School Code"
                  className={getInputClassName("schoolCode")}
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  required
                />
                {validationErrors.schoolCode && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {validationErrors.schoolCode}
                  </div>
                )}
              </>
            )}

            <div className="flex flex-col items-center mt-4 border-t border-gray-300 pt-4 space-y-3">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <a
                href="/login"
                className="text-sm text-[#014AC6] hover:underline"
              >
                Already have an account? Log in
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side */}
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
        <div className="relative p-10 rounded-lg text-center max-w-2xl">
          <h3 className="text-3xl font-bold mb-4">Join Zuni Platform</h3>
          <p className="text-lg mb-6">
            Start managing your certificates securely and efficiently with
            blockchain technology.
          </p>
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4">University Partners</h3>
            <div className="flex justify-center gap-6">
              <img
                src={UIT}
                alt="UIT"
                className="h-28 hover:scale-105 transition duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
