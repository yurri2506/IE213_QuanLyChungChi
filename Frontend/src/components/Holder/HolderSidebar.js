import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faCircleUser,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

const HolderSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { label: "Info", icon: faCircleUser, to: "/info-holder" },
    { label: "Degree", icon: faGraduationCap, to: "/degree-holder" },
    { label: "Send proof", icon: faPaperPlane, to: "/send-proof" },
  ];

  return (
    <>
      {/* Background overlay when sidebar is open (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <nav
        className={`
          fixed top-16 left-0 z-50 h-[calc(100%-64px)] w-52 bg-white shadow-lg flex flex-col items-center transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:top-0 md:mt-16
        `}
      >
        <ul className="list-none w-full">
          {menuItems.map((item) => (
            <li key={item.to} className="my-2">
              <Link
                to={item.to}
                className={`text-base md:text-xl p-2 block rounded font-bold no-underline mx-3 items-center transition-all duration-200
                  ${
                    currentPath === item.to
                      ? "bg-blue-600 text-white scale-[1.03]"
                      : "text-black hover:bg-blue-700 hover:text-white active:bg-[#9AC8CD]"
                  }
                  active:scale-[0.98]`}
                onClick={() => setIsOpen(false)} // auto close on mobile
              >
                <FontAwesomeIcon icon={item.icon} className="mr-2" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default HolderSidebar;
