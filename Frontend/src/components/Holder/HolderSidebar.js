import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faCircleUser,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

const HolderSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      label: "Info",
      icon: faCircleUser,
      to: "/info-holder",
    },
    {
      label: "Degree",
      icon: faGraduationCap,
      to: "/degree-holder",
    },
    {
      label: "Send proof",
      icon: faPaperPlane,
      to: "/send-proof",
    },
  ];

  return (
    <nav className="sidebar w-48 items-center text-white flex flex-col fixed left-0 top-16 bottom-0 bg-white shadow-lg z-50">
      <ul className="list-none w-full">
        {menuItems.map((item) => (
          <li key={item.to} className="my-2">
            <Link
              to={item.to}
              className={`text-xl p-2 block rounded font-bold no-underline mx-3 items-center transition-all duration-200
                ${
                  currentPath === item.to
                    ? "bg-blue-600 text-white scale-[1.03]"
                    : "text-black hover:bg-blue-700 hover:text-white active:bg-[#9AC8CD]"
                }
                active:scale-[0.98]`}
            >
              <FontAwesomeIcon icon={item.icon} className="mr-2" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HolderSidebar;
