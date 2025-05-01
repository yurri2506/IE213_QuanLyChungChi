import React, { useEffect, useState } from "react";
import NavigationIssuer from "../../components/Issuer/NavigationIssuer.js";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
// import { students } from "./student.js";
import { decryptPrivateKey } from "../../utils/utils.js";
import { getSignature } from "../../services/apiUtils.js";
import {
  createDegrees,
  getAllDegrees,
  getIssuerInfo,
} from "../../services/apiIssuer.js";
import degreeTemplate from "../../assets/data.example.json";
import { registerDID } from "../../services/blockchain.service.js";
import { ethers } from "ethers";
import AOS from "aos";
import "aos/dist/aos.css";

function formatDateToDDMMYYYY(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày, thêm '0' nếu < 10
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const formatDate = (dateObj) => {
  const { day, month, year } = dateObj;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const shortenDID = (did) => {
  if (!did) return "";
  return `${did.slice(0, 22)}...${did.slice(-22)}`;
};

export default function ShowDegrees() {
  const [activeTab, setActiveTab] = useState("tab1");
  // const encryptedData = localStorage.getItem("encrypted_private_key");
  // const saltHex = localStorage.getItem("salt");
  // const ivHex = localStorage.getItem("iv");
  const [isLoading, setIsLoading] = useState(false);
  const persistRootRaw = sessionStorage.getItem("persist:root");
  const persistRoot = JSON.parse(persistRootRaw);
  // const name = localStorage.getItem("name") || "TÊN NÈ";
  const encryptedData =
    JSON.parse(persistRoot.encrypted_private_key) || "mã NÈ";
  const saltHex = JSON.parse(persistRoot.salt) || "mã NÈ";
  const ivHex = JSON.parse(persistRoot.iv) || "mã NÈ";

  const changeTab = (e) => {
    setActiveTab(e);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDegrees, setTotalDegrees] = useState(0);
  const [uploadedDegrees, setUploadedDegrees] = useState([]);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showRegisterDIDPopup, setShowRegisterDIDPopup] = useState(false);
  const [password, setPassword] = useState("");

  const [registedDIDStatus, setRegistedDIDStatus] = useState("false");
  const [DID, setDID] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  const fetchIssuerInfo = async () => {
    try {
      const response = await getIssuerInfo();
      console.log(response);
      setDID(response.data.DID);
      setPublicKey(response.data.public_key);
      setSymbol(response.data.symbol);
      setName(response.data.name);
      setRegistedDIDStatus(response.data.registed_DID);
    } catch (error) {
      return error;
    }
  };

  const fetchAllDegrees = async () => {
    try {
      const response = await getAllDegrees(currentPage);
      if (response.status === "SUCCESS") {
        setStudents(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalDegrees(response.pagination.totalDegrees);
      }
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  useEffect(() => {
    fetchAllDegrees();
    fetchIssuerInfo();
  }, [currentPage]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setUploadedDegrees(data);
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Invalid JSON file.",
          });
        }
      };
      reader.readAsText(file);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please upload a valid .json file.",
      });
    }
  };

  const handleClear = () => {
    setUploadedDegrees([]);
  };

  const handleSubmit = () => {
    setShowPasswordPopup(true);
  };

  const handleRegisterDID = () => {
    setShowRegisterDIDPopup(true);
  };

  const handleDownloadTemplate = () => {
    const json = JSON.stringify(degreeTemplate, null, 2);
    const blob = new Blob([json], { type: "application/json" });

    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "degree_template.json";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handlePasswordConfirm = async () => {
    setIsLoading(true);

    try {
      const privateKey = decryptPrivateKey(
        encryptedData,
        password,
        saltHex,
        ivHex
      );

      if (!privateKey) {
        alert("Decryption failed. Please check your password.");
        setIsLoading(false);
        return;
      }

      const sanitizedDegrees = uploadedDegrees.map(
        ({ holder_did, faculty, timeOfTraining, ...rest }) => rest
      );

      console.log(sanitizedDegrees);
      // return;
      const signatures = await getSignature(privateKey, sanitizedDegrees);

      const signedDegrees = uploadedDegrees.map((degree, index) => ({
        ...degree,
        dateOfIssue: formatDate(degree.dateOfIssue),
        signature: signatures.data[index],
      }));

      const normalizedDegrees = signedDegrees.map((degree) => ({
        holder_did: degree.holder_did,
        major: degree.major,
        faculty: degree.faculty,
        time_of_training: degree.timeOfTraining,
        mode_of_study: degree.modeOfStudy,
        year_graduation: degree.yearGraduation,
        classification: degree.classification,
        serial_number: degree.serialNumber,
        reference_number: degree.referenceNumber,
        date_of_issue: degree.dateOfIssue,
        signature: degree.signature,
      }));

      const response = await createDegrees(normalizedDegrees);

      if (response.status === "ERROR") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message,
          confirmButtonColor: "#FF5733",
        });
      } else if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.message,
        }).then(() => {
          window.location.reload();
        });
        setUploadedDegrees([]);
      }

      setShowPasswordPopup(false);
      setPassword("");
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistryDID = async () => {
    try {
      setIsLoading(true);

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
      const targetChainId = "0x13882";

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

      const balance = await provider.getBalance(await signer.getAddress());
      if (balance === 0n) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: "Tài khoản không đủ token để thực hiện giao dịch",
        });
      }
      console.log(DID, publicKey, name, symbol);
      const response = await registerDID({
        issuer_did: DID,
        public_key: publicKey,
        name,
        symbol,
      });

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.message,
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          fetchAllDegrees();
          fetchIssuerInfo();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Đăng ký DID thất bại",
        });
      }
    } catch (error) {
      console.error("Lỗi handleRegistryDID:", error);

      let errorMessage = "Đã xảy ra lỗi khi đăng ký DID";

      if (error.code === 4001) {
        errorMessage = "Bạn đã từ chối giao dịch";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Không đủ token trong tài khoản để giao dịch";
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setShowRegisterDIDPopup(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <NavigationIssuer>
      <Helmet>
        <title>Degree Management</title>
      </Helmet>
      {/* Navigation tab */}
      <div className="bg-gray-200 w-1/4 m-10 p-1 rounded-xl grid grid-cols-2 gap-1">
        <div
          className={`flex justify-center rounded-xl cursor-pointer transition-colors duration-500 ${
            activeTab === "tab1" ? "bg-white" : "bg-gray-200"
          }`}
          onClick={() => changeTab("tab1")}
        >
          <p>Show degree</p>
        </div>
        <div
          className={`flex justify-center rounded-xl cursor-pointer transition-colors duration-500 ${
            activeTab === "tab2" ? "bg-white" : "bg-gray-200"
          }`}
          onClick={() => changeTab("tab2")}
        >
          <p>Update degree</p>
        </div>
      </div>
      <div className="m-10 rounded-xl shadow-lg space-y-6 ">
        {activeTab === "tab1" ? (
          <div>
            <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg">
              <table className="min-w-full text-[0.72rem] text-center border-separate border-spacing-y-3">
                <thead className="bg-white shadow-sm rounded-md">
                  <tr>
                    <th className="px-3 py-2">No.</th>
                    <th className="px-3 py-2">Student ID</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Date of birth</th>
                    <th className="px-3 py-2">Faculty</th>
                    <th className="px-3 py-2">Major</th>
                    <th className="px-3 py-2">Degree classification</th>
                    <th className="px-3 py-2">Mode of study</th>
                    <th className="px-3 py-2">Year graduation</th>
                    <th className="px-3 py-2">Date of issue</th>
                    <th className="px-3 py-2">Serial number</th>
                    <th className="px-3 py-2">Reference number</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, index) => (
                    <tr key={index} className="bg-white rounded-xl shadow-sm">
                      <td className="px-3 py-2 rounded-l-xl">{index + 1}</td>
                      <td className="px-3 py-2">{s.holder_info.holder_id}</td>
                      <td className="px-3 py-2">{s.holder_info.name}</td>
                      <td className="px-3 py-2">
                        {formatDateToDDMMYYYY(s.holder_info.date_of_birth)}
                      </td>
                      <td className="px-3 py-2">{s.faculty}</td>
                      <td className="px-3 py-2">{s.major}</td>
                      <td className="px-3 py-2">{s.classification}</td>
                      <td className="px-3 py-2">{s.mode_of_study}</td>
                      <td className="px-3 py-2">{s.year_graduation}</td>
                      <td className="px-3 py-2">
                        {formatDateToDDMMYYYY(s.date_of_issue)}
                      </td>
                      <td className="px-3 py-2">{s.serial_number}</td>
                      <td className="px-3 py-2 rounded-r-xl">
                        {s.reference_number}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalDegrees === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg">
                  <p className="text-gray-600 text-lg font-semibold">
                    No degrees have been issued yet.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Please issue degrees to see them here.
                  </p>
                </div>
              ) : (
                <div className="flex justify-end gap-4 items-center mt-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {registedDIDStatus === "false" ||
            registedDIDStatus === "pending" ||
            uploadedDegrees.length !== 0 ? null : (
              <div className=" justify-end flex">
                <button
                  onClick={handleDownloadTemplate}
                  className=" self-end flex text-blue-600 px-4 py-2 rounded hover:text-blue-800 hover:underline transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v12m0 0l-3-3m3 3l3-3m-6 6h6"
                    />
                  </svg>
                  Download JSON Template
                </button>
              </div>
            )}

            {registedDIDStatus === "false" ? (
              <div className="flex flex-col items-center justify-center h-96 m-4 bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg">
                <p className="text-gray-700 mb-2 text-center">
                  You don't have permission to issue degrees yet. Please
                  register a DID before uploading
                </p>
                <button
                  onClick={() => {
                    handleRegisterDID();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Register DID now
                </button>
              </div>
            ) : registedDIDStatus === "pending" ? (
              <div className="flex flex-col items-center justify-center h-96 m-4 bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg">
                <p className="text-gray-700 mb-2 text-center">
                  You have registered a DID. Please wait for approval before
                  uploading.
                </p>
                <div className="bg-blue-600 text-white px-4 py-2 rounded">
                  DID is pending approval...
                </div>
              </div>
            ) : uploadedDegrees.length === 0 ? (
              // Tạo một nút download file json mẫu ở đây
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-96 m-4 bg-gray-50">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <svg
                    className="h-10 w-10 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16V4m0 0l-4 4m4-4l4 4m5 4h1a2 2 0 012 2v6a2 2 0 01-2 2h-4a2 2 0 01-2-2v-1"
                    />
                  </svg>
                  <p className="text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    JSON file includes the array of degree (max. 800x400px)
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            ) : (
              <div className="m-4">
                <div className="flex justify-end mb-2 space-x-2">
                  <button
                    onClick={handleClear}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    CLEAR DEGREES
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    SUBMIT DEGREES
                  </button>
                </div>
                <div className="flex justify-center bg-gray-100 p-4 rounded-lg">
                  <table className="min-w-full table-auto border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">No</th>
                        <th className="border px-2 py-1">Holder DID</th>
                        <th className="border px-2 py-1">
                          Degree classification
                        </th>
                        <th className="border px-2 py-1">Year graduation</th>
                        <th className="border px-2 py-1">Serial number</th>
                        <th className="border px-2 py-1">Reference number</th>
                        <th className="border px-2 py-1">Date of issue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedDegrees.map((deg, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="border px-2 py-1 text-center">
                            {index + 1}
                          </td>
                          <td className="border px-2 py-1">
                            {shortenDID(deg.holder_did)}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {deg.classification}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {deg.yearGraduation}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {deg.serialNumber}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {deg.referenceNumber}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {deg.dateOfIssue.day}/{deg.dateOfIssue.month}/
                            {deg.dateOfIssue.year}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showPasswordPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Input Your Password</h2>
            <input
              type="password"
              className="w-full border px-3 py-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPasswordPopup(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordConfirm}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showRegisterDIDPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in"
            data-aos="zoom-in"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              DID Registration Info
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DID
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={DID}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Public Key
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={publicKey}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Symbol
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={symbol}
                  readOnly
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowRegisterDIDPopup(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRegistryDID}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-lg font-medium">
              Processing...
            </span>
          </div>
        </div>
      )}
    </NavigationIssuer>
  );
}
