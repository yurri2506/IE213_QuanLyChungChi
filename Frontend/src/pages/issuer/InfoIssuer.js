import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import NavigationIssuer from "../../components/Issuer/NavigationIssuer.js";
import { getIssuerInfo } from "../../services/apiIssuer.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

const InfoCard = ({ label, value, isDID }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    alert("Copied to clipboard!");
  };

  const shortenDID = (did) => {
    if (!did) return "";
    return `${did.slice(0, 26)}...${did.slice(-26)}`; // Hiển thị 6 ký tự đầu và 6 ký tự cuối
  };

  return (
    <div className="">
      <p className="text-xs font-bold uppercase mb-1">{label}</p>
      <div className="bg-gray-50 shadow-md rounded-md p-2 text-base truncate overflow-hidden whitespace-nowrap text-ellipsis flex items-center justify-between">
        <span>{isDID ? shortenDID(value) : value}</span>
        {isDID && (
          <button
            onClick={handleCopy}
            className="text-blue-500 text-sm ml-2 hover:underline"
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
        )}
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
    { label: "Issuer ID", value: issuer.issuer_id },
    { label: "Name", value: issuer.name },
    { label: "Symbol", value: issuer.symbol },
    { label: "School code", value: issuer.school_code },
    { label: "Public key", value: issuer.public_key, isDID: true },
    { label: "Decentralized Identifier (DID)", value: issuer.DID, isDID: true },
  ];

  return (
    <NavigationIssuer>
      <Helmet>
        <title>Issuer</title>
      </Helmet>
      <h1 className="font-bold text-2xl mt-10 ml-10 ">Your Infomation</h1>
      <div className="holder-info shadow-lg rounded-b-lg m-10 px-10 pb-10">
        <h2 className="text-xl font-bold mb-6">General Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {infoFields.map((item, index) => (
            <InfoCard
              key={index}
              label={item.label}
              value={item.value}
              isDID={item.isDID || false}
            />
          ))}
        </div>
      </div>
    </NavigationIssuer>
  );
}
