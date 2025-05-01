import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import NavigationIssuer from "../../components/Issuer/NavigationIssuer.js";
import { getIssuerInfo } from "../../services/apiIssuer.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faIdCard,
  faIdBadge,
  faUser,
  faHashtag,
  faSchool,
  faKey,
  faFingerprint,
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

export default function InfoIssuer() {
  const [issuer, setIssuer] = useState({});

  const fetchIssuerInfo = async () => {
    const response = await getIssuerInfo();
    if (response) {
      setIssuer(response.data);
      console.log("Issuer info:", response.data);
    } else {
      console.error("Error fetching issuer info:", response.message);
    }
  };

  useEffect(() => {
    fetchIssuerInfo();
  }, []);

  const infoFields = [
    { label: "Issuer ID", value: issuer.issuer_id, icon: faIdCard },
    { label: "Name", value: issuer.name, icon: faSchool },
    { label: "Symbol", value: issuer.symbol, icon: faHashtag },
    { label: "School code", value: issuer.school_code, icon: faIdBadge },
    { label: "Public key", value: issuer.public_key, isDID: true, icon: faKey },
    {
      label: "Decentralized Identifier (DID)",
      value: issuer.DID,
      isDID: true,
      icon: faFingerprint,
    },
  ];

  return (
    <NavigationIssuer>
      <Helmet>
        <title>Issuer Information</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-12">
              General Information
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
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
    </NavigationIssuer>
  );
}
