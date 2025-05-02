import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Huyen from "../assets/Huyen.png";
import HomeHeader from "../components/HomeHeader.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("Form data:", formData);

    const { name, message } = formData;
    const subject = `Contact from ${name}`;
    const body = `Name: ${name}\n\nMessage:\n${message}`;

    // Tạo URL cho Gmail Compose (không dùng trường Cc)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=22520827@gm.uit.edu.vn&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    console.log("Generated Gmail URL:", gmailUrl);
    window.open(gmailUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans pt-16">
      <HomeHeader />

      <section className="relative px-4 md:px-28 py-6 md:flex items-center justify-center overflow-hidden h-[calc(100vh-64px)]">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 z-0"></div>

        <div className="relative z-10 rounded-2xl shadow-xl w-full max-w-6xl h-[90%] grid grid-cols-1 md:grid-cols-[45%_55%] overflow-hidden bg-white">
          <div className="flex flex-col items-center text-center justify-between p-6 border-r-2 border-blue-500">
            <img
              alt="Logo"
              src={Huyen}
              className="h-[45vh] object-cover mb-4 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
            />

            <div className="w-full space-y-3">
              <div className="flex space-x-4 bg-white/90 backdrop-blur-sm w-full p-3 rounded-xl items-start shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-blue-600 text-2xl mt-1">
                  <FontAwesomeIcon icon={faEnvelope} className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-left text-sm text-gray-500 font-medium">
                    Email
                  </p>
                  <p className="font-semibold text-gray-800 text-sm">
                    22520827@gm.uit.edu.vn
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 bg-white/90 backdrop-blur-sm w-full p-3 rounded-xl items-start shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-blue-600 text-2xl mt-1">
                  <FontAwesomeIcon icon={faPhone} className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-left text-sm text-gray-500 font-medium">
                    Phone
                  </p>
                  <p className="font-semibold text-gray-800 text-sm">
                    0364997254
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div data-aos="fade-left" className="p-8 bg-white rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Contact Us
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm">
              If you have any questions or feedback about our website, please
              don't hesitate to leave your information below. We will try to
              respond within 24 hours.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 font-medium text-gray-700 text-sm"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block mb-1 font-medium text-gray-700 text-sm"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Enter your message"
                  className="w-full border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 h-24 resize-none text-sm"
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                >
                  Go to Gmail
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
