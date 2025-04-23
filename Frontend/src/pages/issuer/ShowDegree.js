import React, { useState } from "react";
import NavigationIssuer from "../../components/Issuer/NavigationIssuer.js";
import { Helmet } from "react-helmet";
import { students } from "./student.js";

export default function HomeIssuer() {
  const [activeTab, setActiveTab] = useState("tab1");

  const changeTab = (e) => {
    setActiveTab(e);
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
          <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Major */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Major
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Faculty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Time of Training */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time of Training
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Mode of Study */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode of Study
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Year Graduation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year Graduation
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Classification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classification
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Serial Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Number
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Date of Issue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Issue
                </label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </NavigationIssuer>
  );
}
