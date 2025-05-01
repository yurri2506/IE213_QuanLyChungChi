import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import BackgroundImage from "../assets/bgImage.jpg";
import Huyen from "../assets/Huyen.png";
import EmailImg from "../assets/mail.png";
import PhoneImg from "../assets/telephone.png";
import HomeHeader from "../components/HomeHeader.js";

function Contact() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-white text-white font-sans pt-16 ">
      <HomeHeader />

      <section className="relative px-4 md:px-28 py-24 md:flex items-center justify-center overflow-hidden h-[100vh]">
        {/* <img
          src={BackgroundImage}
          alt="Background"
          className="absolute inset-0 w-full h-[100vh] object-cover opacity-75 z-0"
          data-aos="fade-down"
        /> */}
        <div className="absolute inset-0 h-[100vh] bg-black/60 z-0"></div>

        <div className="relative z-10 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] grid grid-cols-1 md:grid-cols-[40%_60%] overflow-hidden ">
          <div className="flex flex-col items-center text-center justify-between rounded-xl">
            <img
              alt="Logo"
              src={Huyen}
              className=" h-[66vh] object-cover mb-4 rounded-xl"
            />

            <div className="w-full rounded-xl items-center justify-center">
              <div className="flex space-x-4 bg-gray-100 w-full px-3 rounded-xl items-start mb-4 ">
                {/* Icon Gmail bên trái */}
                <div className="text-red-600 text-2xl mt-1">
                  <img alt="Mail" className="w-12 h-12 p-2" />
                </div>

                {/* Nội dung bên phải */}
                <div className="">
                  <p className="text-left text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-800">abc@gmail.com</p>
                </div>
              </div>

              <div className="flex space-x-4 bg-gray-100 w-full px-3 rounded-xl items-start ">
                {/* Icon Phone bên trái */}
                <div className="text-red-600 text-2xl mt-1">
                  <img alt="Phone" className="w-11 h-11 p-2" />
                </div>

                {/* Nội dung bên phải */}
                <div className="  ">
                  <p className="text-left text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-800">0987654321</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Contact form */}
          <div data-aos="fade-left" className="ml-2  rounded-xl bg-white p-10">
            <h2 className="text-2xl font-bold mb-6 text-black">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-black mb-6 ">
              Nếu có câu hỏi hay góp ý về trang web của chúng tôi, đừng ngại
              ngần để lại thông tin dưới đây. Chúng tôi sẽ cố gắng phản hồi
              trong vòng 24h
            </p>
            <form className="space-y-4">
              <label
                htmlFor="name"
                className="block mb-0 font-medium text-gray-700"
              >
                Họ và tên
              </label>
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full border p-1 rounded bg-gray-100"
              />

              <label
                htmlFor="email"
                className="block mb-0 font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-1 rounded bg-gray-100"
              />

              <label
                htmlFor="message"
                className="block mb-0 font-medium text-gray-700"
              >
                Nội dung
              </label>
              <textarea
                placeholder="Nội dung"
                className="w-full border p-1 rounded bg-gray-100 h-32"
              ></textarea>
              <div className="flex justify-center">
                <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
                  Gửi liên hệ
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
