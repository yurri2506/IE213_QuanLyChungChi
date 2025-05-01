import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronDown,
  faKey,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import ZuniLogo from "../assets/ZUNI.svg";

const PageHeader = () => {
  const persistRootRaw = sessionStorage.getItem("persist:root");
  const persistRoot = JSON.parse(persistRootRaw);
  // const name = localStorage.getItem("name") || "TÊN NÈ";
  const name = JSON.parse(persistRoot.name) || "TÊN NÈ";
  

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleLogout = async (e) => {
    setIsDropdownOpen(false);
    // try {
    //   e.preventDefault();
    //   // localStorage.removeItem("access_token");
    //   // localStorage.removeItem("refresh_token");
    //   // localStorage.removeItem("name");
    //   localStorage.clear();
    //   window.location.href = "/login";
    // } catch (error) {
    //   console.error("Error during logout:", error);
    // }
    window.location.href = "/logout";
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className="header bg-white fixed top-0 w-full h-16 flex justify-between items-center p-5 border-b border-gray-300">
      <div className="flex gap-2">
        <img alt="logo" src={ZuniLogo} className="h-10 w-10 " />
        <h1 className="text-2xl text-center align-middle  font-bold z-50">
          ZUNI CLIENT
        </h1>
      </div>

      <div className="flex items-center space-x-1">
        <div>
          Hello, <span className="font-bold">{name}</span>{" "}
        </div>
        <img
          src="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
          alt="Avatar"
          className="avatar w-10 h-10 rounded-full mr-2 border-2"
        />
        <button
          type="button"
          className="bg-none text-xs cursor-pointer ml-6 mt-1 hover:text-blue-600 focus:text-blue-600 "
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <FontAwesomeIcon icon={faCircleChevronDown} size="xl" />
        </button>
      </div>
      <ul
        ref={dropdownRef}
        className={`
                        top-14 right-0
                        absolute bg-white shadow-md list-none w-44 rounded-2xl border-2
                        transition-all duration-300 ease-in-out transform z-50
                        ${
                          isDropdownOpen
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 pointer-events-none"
                        }
                    `}
      >
        <li>
          <Link
            to="/change-password"
            className="p-3 text-sm hover:bg-gray-200 block"
          >
            <FontAwesomeIcon
              icon={faKey}
              style={{ color: "black" }}
              className="mx-2"
            />
            Thay đổi mật khẩu
          </Link>
        </li>

        <li>
          <button
            className="p-3 text-sm hover:bg-gray-200 block w-full text-left"
            onClick={handleLogout}
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              style={{ color: "black" }}
              className="mx-2"
            />
            Đăng xuất
          </button>
        </li>
      </ul>
    </header>
  );
};

export default PageHeader;
