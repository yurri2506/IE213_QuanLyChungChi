import React from "react";
import HomeHeader from "../components/HomeHeader.js";

export default function Features() {
  return (
    <div className="min-h-screen bg-white text-white font-sans pt-16">
      <HomeHeader />
      <div className="flex text-black flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-4">Features</h1>
      </div>
    </div>
  );
}
