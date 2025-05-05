import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import NavigationVerifier from "../../components/Verified/NavigationVerifier.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faBuilding,
  faIdCard,
  faFingerprint,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import { getVerifierInfo } from "../../services/apiVerifier.js";

// const businessData = {
//   id: "fpt",
//   name: "FPT Software",
//   did: "65ae6f829470b47dcaf5cf2d9625c3eb19998864af571366733b8fa1",
//   symbol: "FPT",
// };

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
            <span className="text-gray-700 break-all">
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

const InfoVerifier = () => {
  const [verifier, setVerifier] = useState({});

  const fetchVerifierInfo = async () => {
    const response = await getVerifierInfo();
    if (response) {
      setVerifier(response.data);
      console.log("Verifier info:", response.data);
    } else {
      console.error("Error fetching verifier info:", response.message);
    }
  };

  useEffect(() => {
    fetchVerifierInfo();
  }, []);

  const infoFields = [
    { label: "Business ID", value: verifier.verifier_id, icon: faIdCard },
    { label: "Business Name", value: verifier.name, icon: faBuilding },
    { label: "DID", value: verifier.DID, isDID: true, icon: faFingerprint },
    { label: "Symbol", value: verifier.symbol, icon: faHashtag },
  ];

  return (
    <NavigationVerifier>
      <Helmet>
        <title>Verifier Information</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-4">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-12">
              Verifier Information
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* <h2 className="text-2xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-100">
              Business Information
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
    </NavigationVerifier>
  );
};

export default InfoVerifier;
