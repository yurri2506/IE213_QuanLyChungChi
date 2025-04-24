import React, { useState } from "react";
import NavigationIssuer from "../../components/Issuer/NavigationIssuer.js";
import { Helmet } from "react-helmet";
import { students } from "./student.js";

export default function HomeIssuer() {
  const [activeTab, setActiveTab] = useState("tab1");

  const changeTab = (e) => {
    setActiveTab(e);
  };

  const [uploadedDegrees, setUploadedDegrees] = useState([]);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [password, setPassword] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setUploadedDegrees(data); // Cập nhật dữ liệu bằng cấp
        } catch (err) {
          alert("Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .json file.");
    }
  };

  const handleClear = () => {
    setUploadedDegrees([]);
  };

  const handleSubmit = () => {
    setShowPasswordPopup(true); // hiển thị popup
  };

  const handlePasswordConfirm = () => {
    console.log("Submitting degrees with password:", password);
    console.log("Degrees:", uploadedDegrees);
    setShowPasswordPopup(false);
    setPassword(""); // reset
  };

  return (
    <NavigationIssuer>
      <Helmet>
        <title>Quản lý bằng cấp</title>
      </Helmet>
      {/* Navigation tab */}
      <div className="bg-gray-200 w-1/4 m-10 p-1 rounded-xl grid grid-cols-2 gap-1">
        <div
          className={`flex justify-center rounded-xl transition-colors duration-500 ${
            activeTab === "tab1" ? "bg-white" : "bg-gray-200"
          }`}
          onClick={() => changeTab("tab1")}
        >
          <p>Show degree</p>
        </div>
        <div
          className={`flex justify-center rounded-xl transition-colors duration-500 ${
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
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-1 py-2">No.</th>
                  <th className="border px-1 py-2">Student ID</th>
                  <th className="border px-1 py-2">Name</th>
                  <th className="border px-1 py-2">Date of birth</th>
                  <th className="border px-1 py-2">Faculty</th>
                  <th className="border px-1 py-2">Major</th>
                  <th className="border px-1 py-2">Degree classification</th>
                  <th className="border px-1 py-2">Mode of study</th>
                  <th className="border px-1 py-2">Year graduation</th>
                  <th className="border px-1 py-2">Date of issue</th>
                  <th className="border px-1 py-2">Serial number</th>
                  <th className="border px-1 py-2">Reference number</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, index) => (
                  <tr
                    key={s.studentId}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border px-2 py-1 text-center">{s.no}</td>
                    <td className="border px-2 py-1">{s.studentId}</td>
                    <td className="border px-2 py-1">{s.name}</td>
                    <td className="border px-2 py-1">{s.dob}</td>
                    <td className="border px-2 py-1">{s.faculty}</td>
                    <td className="border px-2 py-1">{s.major}</td>
                    <td className="border px-2 py-1">
                      {s.degreeClassification}
                    </td>
                    <td className="border px-2 py-1">{s.modeOfStudy}</td>
                    <td className="border px-2 py-1 text-center">
                      {s.yearGraduation}
                    </td>
                    <td className="border px-2 py-1">{s.dateOfIssue}</td>
                    <td className="border px-2 py-1">{s.serialNumber}</td>
                    <td className="border px-2 py-1">{s.referenceNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-md">
          //   <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          //     {/* Major */}
          //     <div>
          //       <label className="block text-sm font-medium text-gray-700 mb-1">
          //         Major
          //       </label>
          //       <input
          //         type="text"
          //         className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          //       />
          //     </div>

          //     {/* Faculty */}
          //     <div>
          //       <label className="block text-sm font-medium text-gray-700 mb-1">
          //         Faculty
          //       </label>
          //       <input
          //         type="text"
          //         className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          //       />
          //     </div>

          //     {/* Time of Training */}
          //     <div>
          //       <label className="block text-sm font-medium text-gray-700 mb-1">
          //         Time of Training
          //       </label>
          //       <input
          //         type="text"
          //         className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          //       />
          //     </div>

          //     {/* Mode of Study */}
          //     <div>
          //       <label className="block text-sm font-medium text-gray-700 mb-1">
          //         Mode of Study
          //       </label>
          //       <input
          //         type="text"
          //         className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          //       />
          //     </div>

          //     {/* Year Graduation */}
          //     <div>
          //       <label className="block text-sm font-medium text-gray-700 mb-1">
          //         Year Graduation
          //       </label>
          //       <input
          //         type="number"
          //         className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          //       />
          //     </div>

          //     {/* Classification */}
          //     <div>
          //       <label className="block text-sm font-medium text-gray-700 mb-1">
          //         Classification
          //       </label>
          //       <input
          //         type="text"
          //         className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          //       />
          //     </div>

          //     {/* Serial Number */}
          //     <div>
          //       <label className="block text-sm font-medium text-gray-700 mb-1">
          //         Serial Number
          //       </label>
          //       <input
          //         type="text"
          //         className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          //       />
          //     </div>

          //     {/* Reference Number */}
          //     <div>
          //       <label className="block text-sm font-medium text-gray-700 mb-1">
          //         Reference Number
          //       </label>
          //       <input
          //         type="text"
          //         className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          //       />
          //     </div>

          //     {/* Date of Issue */}
          //     <div>
          //       <label className="block text-sm font-medium text-gray-700 mb-1">
          //         Date of Issue
          //       </label>
          //       <input
          //         type="date"
          //         className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          //       />
          //     </div>
          //   </form>
          // </div>
          // <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-96 m-4 bg-gray-50">
          //   <label
          //     htmlFor="file-upload"
          //     className="flex flex-col items-center justify-center cursor-pointer"
          //   >
          //     <svg
          //       xmlns="http://www.w3.org/2000/svg"
          //       className="h-10 w-10 text-gray-400 mb-2"
          //       fill="none"
          //       viewBox="0 0 24 24"
          //       stroke="currentColor"
          //     >
          //       <path
          //         strokeLinecap="round"
          //         strokeLinejoin="round"
          //         strokeWidth="2"
          //         d="M7 16V4m0 0l-4 4m4-4l4 4m5 4h1a2 2 0 012 2v6a2 2 0 01-2 2h-4a2 2 0 01-2-2v-1"
          //       />
          //     </svg>
          //     <p className="text-gray-600">Click to upload or drag and drop</p>
          //     <p className="text-sm text-gray-400 mt-1">
          //       JSON file includes the array of degree (max. 800x400px)
          //     </p>
          //     <input
          //       id="file-upload"
          //       type="file"
          //       accept=".json"
          //       className="hidden"
          //       onChange={(e) => handleFileUpload(e)}
          //     />
          //   </label>
          // </div>
          <div>
            {uploadedDegrees.length === 0 ? (
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
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="border px-2 py-1 text-center">
                          {index + 1}
                        </td>
                        <td className="border px-2 py-1">{deg.holderDid}</td>
                        <td className="border px-2 py-1">
                          {deg.degreeClassification}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {deg.yearGraduation}
                        </td>
                        <td className="border px-2 py-1">{deg.serialNumber}</td>
                        <td className="border px-2 py-1">
                          {deg.referenceNumber}
                        </td>
                        <td className="border px-2 py-1">{deg.dateOfIssue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
    </NavigationIssuer>
  );
}
