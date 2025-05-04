import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronDown,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import ZuniLogo from "../assets/ZUNI.svg";

const PageHeader = ({ setIsSidebarOpen }) => {
  const persistRootRaw = sessionStorage.getItem("persist:root");
  const persistRoot = JSON.parse(persistRootRaw);
  const name = JSON.parse(persistRoot.name) || "TÊN NÈ";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    window.location.href = "/logout";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white fixed top-0 w-full h-16 flex justify-between items-center px-4 border-b border-gray-300 z-50">
      
      {/* Left: Logo + Sidebar Toggle */}
      <div className="flex items-center gap-2">
        {/* Toggle for sidebar (mobile only) */}
        <button
          className="md:hidden text-xl text-black focus:outline-none"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          &#9776;
        </button>

        {/* Logo (always visible) */}
        <div className="items-center gap-2 hidden md:flex">
          <img alt="logo" src={ZuniLogo} className="h-10 w-10" />
          <h1 className="text-xl font-bold ">ZUNI CLIENT</h1>
        </div>
      </div>

      {/* Center: Logo + title for mobile only */}
      <div className="absolute left-1/2 transform -translate-x-1/2 md:hidden flex items-center gap-2">
        <img alt="logo" src={ZuniLogo} className="h-8 w-8" />
        <h1 className="text-base font-bold">ZUNI CLIENT</h1>
      </div>

      {/* Right: Avatar + Name + Dropdown */}
      <div className="flex items-center space-x-2">
        <div className="hidden md:block">
          Hello, <span className="font-bold">{name}</span>
        </div>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="focus:outline-none"
        >
          <img
            src="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2"
          />
        </button>
        {/* Optional chevron icon */}
        <button
          type="button"
          className="hidden md:block text-xs hover:text-blue-600 focus:text-blue-600"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <FontAwesomeIcon icon={faCircleChevronDown} size="lg" />
        </button>
      </div>

      {/* Dropdown logout */}
      <ul
        ref={dropdownRef}
        className={`absolute top-14 right-4 bg-white shadow-md list-none w-44 rounded-2xl border-2 transition-all duration-300 ease-in-out transform z-50
          ${isDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <li>
          <button
            className="p-3 text-sm hover:bg-gray-200 block w-full text-left"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="mx-2 text-black" />
            Đăng xuất
          </button>
        </li>
      </ul>
    </header>
  );
};

export default PageHeader;
