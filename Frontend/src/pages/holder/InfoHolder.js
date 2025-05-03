import React, { useState, useEffect } from "react";
import NavigationHolder from "../../components/Holder/NavigationHolder.js";
import { Helmet } from "react-helmet";
import { getUserInfo } from "../../services/apiHolder.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faUser,
  faIdCard,
  faFingerprint,
  faVenusMars,
  faCalendarAlt,
  faMapMarkerAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

const InfoCard = ({ label, value, isDID, icon }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    alert("Copied to clipboard!");
  };

  const shortenDID = (did) => {
    if (!did) return "";
    return `${did.slice(0, 26)}...${did.slice(-26)}`;
  };

  return (
    <div className="transform transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-2 mb-2">
        <FontAwesomeIcon icon={icon} className="text-blue-600" />
        <label className="text-sm font-semibold text-gray-600 uppercase">
          {label}
        </label>
      </div>
      <div className="relative">
        <div className="bg-white shadow-md rounded-lg p-3 text-base border border-gray-100 hover:border-blue-200 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 truncate max-w-[98%]">
              {isDID ? shortenDID(value) : value}
            </span>
            {isDID && (
              <button
                onClick={handleCopy}
                className="text-blue-500 hover:text-blue-700 transition-colors duration-300 rounded-full hover:bg-blue-50 ml-2"
                title="Copy to clipboard"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function formatDate(isoDateString) {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatGender(string) {
  if (string === "0") return "Male";
  if (string === "1") return "Female";
}

const Info = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await getUserInfo();
      if (response) {
        setUser(response.data);
        console.log("User info:", response.data);
      } else {
        console.error("Error fetching user info:", response.message);
      }
    };
    fetchUserInfo();
  }, []);

  //  const user = {
  //     studentId: "19110004",
  //     citizenId: "35790808174",
  //     name: "Trịnh Gia Bảo",
  //     gender: "Male",
  //     did: "0701fb8cbdef7b23f8d9703ad2b5eaf09de741db5c4f6370d0b872d0de95f9a",
  //     dateOfBirth: "7/19/2001",
  //     placeOfBirth: "Cần Thơ",
  //     address: "Bld Mihail Kogălniceanu, nr. 8 Bl 1, Sc 1, Ap 09",
  // };

  const infoFields = [
    { label: "Student ID", value: user.holder_id, icon: faIdCard },
    {
      label: "Decentralized Identifier (DID)",
      value: user.DID,
      isDID: true,
      icon: faFingerprint,
    },
    { label: "Name", value: user.name, icon: faUser },
    {
      label: "Date of Birth",
      value: formatDate(user.date_of_birth),
      icon: faCalendarAlt,
    },
    { label: "Citizen ID", value: user.citizen_id, icon: faIdCard },
    {
      label: "Place of Birth",
      value: user.place_of_birth,
      icon: faMapMarkerAlt,
    },
    { label: "Gender", value: formatGender(user.gender), icon: faVenusMars },
    { label: "Address", value: user.address, icon: faHome },
  ];

  return (
    <NavigationHolder>
      <Helmet>
        <title>Holder Information</title>
      </Helmet>
      <div className="min-h-screen  bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-12">
              General Information
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* <h2 className="text-2xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-100">
              General Information
            </h2> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {infoFields.map((item, index) => (
                <InfoCard
                  key={index}
                  label={item.label}
                  value={item.value}
                  isDID={item.isDID || false}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </NavigationHolder>
  );
};

export default Info;
