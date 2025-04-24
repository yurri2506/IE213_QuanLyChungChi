// import React, { useEffect, useState } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";
// // import { signup } from "../services/apiAuth.js"; // API đăng ký
// import ZuniLogo from "../../assets/ZUNI.svg";
// import UIT from "../../assets/UIT.svg";
// import BackgroundImage from "../../assets/bgImage.jpg";

// function SignIn() {
//   const [userId, setUserId] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("HOLDER");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     // try {
//     //   const response = await signup(userId, password, role);
//     //   if (response && response.success) {
//     //     alert("Account created successfully!");
//     //     window.location.href = "/login";
//     //   } else {
//     //     setError(response.message || "Signup failed.");
//     //   }
//     // } catch (err) {
//     //   setError("An error occurred during sign up. Please try again.");
//     // } finally {
//     //   setLoading(false);
//     // }
//     console.log("thành công")
//   };

//   useEffect(() => {
//     AOS.init({ duration: 1000, once: true });
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       {/* Left Side */}
//       <div
//         className="w-full md:w-[40%] flex flex-col justify-center items-center px-6 py-12 bg-white z-10"
//         data-aos="fade-right"
//       >
//         <div className="max-w-md w-full text-center">
//           <img
//             src={ZuniLogo}
//             alt="icon"
//             className="w-24 h-24 mx-auto mb-6 hover:scale-110 transition duration-300"
//           />
//           <h2 className="text-2xl font-bold mb-2 text-[#014AC6]">
//             Create an account
//           </h2>
//           <p className="mb-6 text-gray-600">
//             Sign up as an Issuer / Holder / Verifier
//           </p>

//           <form className="space-y-4" onSubmit={handleSignUp}>
//             <input
//               type="text"
//               placeholder="User ID"
//               className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#014AC6]"
//               value={userId}
//               onChange={(e) => setUserId(e.target.value)}
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#014AC6]"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#014AC6]"
//             >
//               <option value="HOLDER">Holder</option>
//               <option value="issuer">Issuer</option>
//               <option value="VERIFIER">Verifier</option>
//             </select>

//             <div className="flex flex-col items-center mt-4 border-t border-gray-300 pt-4 space-y-3">
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
//               >
//                 Sign Up
//               </button>
//               {error && <p className="text-red-500 text-sm">{error}</p>}
//               <a
//                 href="/login"
//                 className="text-sm text-[#014AC6] hover:underline"
//               >
//                 Already have an account? Log in
//               </a>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Right Side */}
//       <div
//         className="hidden md:flex w-[60%] relative items-center justify-center text-white"
//         style={{
//           backgroundImage: `url(${BackgroundImage})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//         data-aos="fade-left"
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-50"></div>
//         <div className="relative p-10 rounded-lg text-center max-w-2xl">
//           <h3 className="text-3xl font-bold mb-4">Join Zuni Platform</h3>
//           <p className="text-lg mb-6">
//             Start managing your certificates securely and efficiently with
//             blockchain technology.
//           </p>
//           <div className="mb-10">
//             <h3 className="text-xl font-bold mb-4">University Partners</h3>
//             <div className="flex justify-center gap-6">
//               <img
//                 src={UIT}
//                 alt="UIT"
//                 className="h-28 hover:scale-105 transition duration-300"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import "aos/dist/aos.css";
import ZuniLogo from "../../assets/ZUNI.svg";
import UIT from "../../assets/UIT.svg";
import BackgroundImage from "../../assets/bgImage.jpg";
import axios from "axios";

function SignIn() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Name field
  const [symbol, setSymbol] = useState(""); // Symbol field
  const [schoolCode, setSchoolCode] = useState(""); // Only for Issuer
  const [role, setRole] = useState("ISSUER"); // Default to "Issuer"
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const API_BASE_URL = "http://localhost:3001/api/auth";

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

      if (response.status === 201 || response.status === 200) {
        window.location.href = "/login";
      } else {
        setError(response.data?.message || "Signup failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message || "An error occurred during sign up."
      );
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
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#014AC6]"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#014AC6]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#014AC6]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Symbol"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#014AC6]"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#014AC6]"
            >
              <option value="ISSUER">Issuer</option>
              <option value="VERIFIER">Verifier</option>
            </select>

            {/* Render additional fields based on role */}
            {role === "ISSUER" && (
              <input
                type="text"
                placeholder="School Code"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#014AC6]"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value)}
                required
              />
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

export default SignIn;
