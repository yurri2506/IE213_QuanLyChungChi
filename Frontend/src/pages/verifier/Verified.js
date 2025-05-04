import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCopy,
  faSyncAlt,
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import NavigationVerifier from "../../components/Verified/NavigationVerifier.js";
import { getAllSummittedPoofs } from "../../services/apiVerifier.js";
import Swal from "sweetalert2";
import { ethers } from "ethers";
import { verifyProof } from "../../services/blockchain.service.js";

function hexToString(hex) {
  // Bỏ tiền tố '0x' nếu có
  if (hex.startsWith("0x")) {
    hex = hex.slice(2);
  }

  // Bỏ các padding '00' đầu nếu có
  hex = hex.replace(/^0+/, "");

  // Chuyển từng cặp hex thành ký tự
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }

  return str;
}

const shortenDID = (did) => {
  if (!did) return "";
  return `${did.slice(0, 5)}...${did.slice(-5)}`; // Hiển thị 6 ký tự đầu và 6 ký tự cuối
};

function formatUTCToVNTime(utcString) {
  const date = new Date(utcString);

  // Lấy thời gian tại Việt Nam (UTC+7)
  const vnDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );

  // Lấy giờ và phút
  let hours = vnDate.getHours();
  const minutes = vnDate.getMinutes().toString().padStart(2, "0");

  // Lấy AM/PM
  const isPM = hours >= 12;
  const period = isPM ? "PM" : "AM";

  // Chuyển giờ sang định dạng 12 giờ
  hours = hours % 12;
  if (hours === 0) hours = 12; // Sửa để giờ 0 trở thành 12 (12 AM hoặc 12 PM)

  const hourStr = hours.toString().padStart(2, "0");

  // Lấy ngày/tháng/năm
  const day = vnDate.getDate().toString().padStart(2, "0");
  const month = (vnDate.getMonth() + 1).toString().padStart(2, "0");
  const year = vnDate.getFullYear();

  return `${hourStr}:${minutes} ${period} ${day}/${month}/${year}`;
}

const Verified = () => {
  const [proofs, setProofs] = useState([]);
  const [search, setSearch] = useState("");

  const fetchProofs = async () => {
    const response = await getAllSummittedPoofs();
    if (response) {
      setProofs(response.data);
      console.log("Proofs:", response.data);
    } else {
      console.error("Error fetching proofs:", response.message);
    }
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  const handleVerifyProof = async (proofId, issuer_did, proof, major) => {
    try {
      if (!window.ethereum) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: "Vui lòng cài đặt MetaMask để tiếp tục",
        });
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const targetChainId = "0x13882"; // Polygon Amoy Testnet

      if (chainId !== targetChainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: targetChainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: targetChainId,
                  chainName: "Polygon Amoy Testnet",
                  nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
                  rpcUrls: ["https://rpc-amoy.polygon.technology"],
                  blockExplorerUrls: ["https://amoy.polygonscan.com/"],
                },
              ],
            });
          } else {
            return Swal.fire({
              icon: "error",
              title: "Error",
              text: "Vui lòng chuyển mạng MetaMask sang Polygon Amoy Testnet",
            });
          }
        }
      }

      const response = await verifyProof({
        proofId,
        issuer_did,
        proof,
        major,
      });
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.message,
        });
        fetchProofs();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message,
        });
        fetchProofs();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NavigationVerifier>
     <div className="mx-10 mt-10">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <h1 className="font-bold text-xl md:text-2xl mb-4 md:mb-0">Verified Degrees</h1>
        <div className="flex flex-row items-center gap-2">
          <div className="flex rounded-lg px-4 py-1 w-full md:w-80 border-2 focus:border-blue-700 border-blue-600 text-sm">
            <input
              type="text"
              placeholder="Input DID to search"
              className="px-2 py-1 w-full text-sm focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="ml-1 text-gray-500">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <button className="text-gray-600 hover:text-gray-900 text-lg">
            <FontAwesomeIcon icon={faSyncAlt} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto border-collapse shadow rounded bg-gray-200">
          <thead className=" text-gray-700 font-semibold text-sm">
            <tr>
              <th className="px-3 py-2 my-1">No</th>
              <th className="px-3 py-2 my-1">Holder DID</th>
              <th className="px-3 py-2 my-1">Holder Name</th>
              <th className="px-3 py-2 my-1">Major</th>
              <th className="px-3 py-2 my-1">Issuer DID</th>
              <th className="px-3 py-2 my-1">Issuer Name</th>
              <th className="px-3 py-2 my-1">Status</th>
              <th className="px-3 py-2 my-1">Verified Time</th>
            </tr>
          </thead>
          <tbody>
            {proofs
              .filter((row) => row.holder_did.includes(search))
              .map((row, index) => (
                <tr key={row.holder_did} className="text-center bg-white rounded-3xl">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 flex items-center justify-center gap-3 rounded shadow my-2">
                    <span>{shortenDID(row.holder_did)}</span>
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    />
                  </td>
                  <td className="px-2 py-3">{row.holder_name}</td>
                  {row.is_verified === false ? (
                    <>
                      <td className="px-2 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          NOT YET VERIFIED
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="px-2 py-1 bg-green-100 text-blue-800 rounded text-xs shadow-none m-0">
                          NOT YET VERIFIED
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-2 py-3">{hexToString(row.major)}</td>
                      <td className="p-2 flex items-center justify-center gap-2 rounded shadow my-2">
                        {shortenDID(row.issuer_did)}
                        <FontAwesomeIcon
                          icon={faCopy}
                          className="text-gray-500 hover:text-gray-700 cursor-pointer "
                        />
                      </td>
                    </>
                  )}
                  <td className="px-2 py-3">{row.issuer_name}</td>
                  <td className="px-2 py-3">
                    {row.is_verified === true ? (
                      <span className="text-blue-600 font-medium flex items-center justify-center gap-1 text-sm">
                        <FontAwesomeIcon icon={faCheckCircle} /> Valid
                      </span>
                    ) : (
                      <span className="text-yellow-500 font-medium flex items-center justify-center gap-2 text-sm">
                        <FontAwesomeIcon icon={faExclamationTriangle} /> Pending
                        <button
                          onClick={() =>
                            handleVerifyProof(
                              row._id,
                              row.issuer_did,
                              row.proof,
                              row.major
                            )
                          }
                          className="px-2 py-1 rounded border border-purple-500 text-purple-600 hover:bg-purple-100 text-xs"
                        >
                          VERIFY
                        </button>
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-3">
                    {row.is_verified === true
                      ? formatUTCToVNTime(row.updated_at)
                      : "N/A"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>

    </NavigationVerifier>
  );
};

export default Verified;
