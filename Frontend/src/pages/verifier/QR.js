import React, { createContext, useContext, useState } from "react";
import { Helmet } from "react-helmet";
import NavigationVerifier from "../../components/Verified/NavigationVerifier.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const businessData = {
  id: "fpt",
  name: "FPT Software",
  did: "65ae6f829470b47dcaf5cf2d9625c3eb19998864af571366733b8fa1",
  symbol: "FPT",
};

const QR = () => {
  const [typeDegree, setTypeDegree] = useState("Bachelor of degree");
  const [showQR, setShowQR] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(businessData.did);
    alert('Copied DID to clipboard!');
  };

  return (
      <NavigationVerifier>
        <Helmet>
          <title>Thông tin bên xác minh</title>
        </Helmet>

        <div className="flex flex-row shadow-lg rounded-b-lg m-10 p-8 bg-white gap-10">
          {/* Left panel: Business Information */}
          <div className="flex-1 bg-gray-200 rounded-md p-6">
            <h2 className="bg-white p-4 rounded-md text-xl font-bold mb-6">BUSINESS INFORMATION</h2>
            <div className="space-y-4 px-5">
              <div>
                <label className="block text-sm font-semibold mb-1">BUSINESS ID</label>
                <p className="w-full border rounded-md px-3 py-2 bg-white shadow-sm">{businessData.id}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">BUSINESS NAME</label>
                <p className="w-full border rounded-md px-3 py-2 bg-white shadow-sm">{businessData.name}</p>
              </div>
              <label className="block text-sm font-semibold mb-1">DID</label>
              <div className="relative">
                <p className="w-full border rounded-md px-3 py-2 bg-white shadow-sm">{businessData.did}</p>
                <button onClick={handleCopy} className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">SYMBOL</label>
                <input type="text" value={businessData.symbol} className="w-full border rounded-md px-3 py-2 bg-white shadow-sm" readOnly />
              </div>
            </div>
          </div>

          {/* Right panel: Verify Requests Controller */}
          <div className="bg-white rounded-2xl shadow p-6 w-full md:w-80">
            <h2 className="text-md font-bold mb-6">VERIFY REQUESTS CONTROLLER</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">TYPE OF DEGREE</label>
                <input
                  type="text"
                  value={typeDegree}
                  onChange={(e) => setTypeDegree(e.target.value)}
                  className="w-full border-2 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:border-2 focus:border-blue-500"
                />
              </div>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow w-full font-semibold"
                onClick={() => setShowQR(!showQR)}
              >
                GET THE QR
              </button>
            </div>

            {showQR && (
              <div className="mt-4 flex justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=$19110004`}
                  alt="QR"
                  className="w-full border-4 border-blue-500 rounded p-2 m-3 object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </NavigationVerifier>
  );
};

export default QR;
