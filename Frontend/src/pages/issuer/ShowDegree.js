import React, { useState } from "react";

const Sidebar = ({ selectedTab, onSelectTab }) => (
  <div className="w-1/6 bg-white border-r min-h-screen p-4">
    <div
      className={`p-3 rounded-md cursor-pointer mb-2 ${
        selectedTab === "info" ? "bg-gray-200" : ""
      }`}
      onClick={() => onSelectTab("info")}
    >
      Info
    </div>
    <div
      className={`p-3 rounded-md cursor-pointer ${
        selectedTab === "degree" ? "bg-green-600 text-white" : ""
      }`}
      onClick={() => onSelectTab("degree")}
    >
      Degree
    </div>
  </div>
);

const Header = () => (
  <div className="flex justify-between items-center p-4 bg-white border-b">
    <h1 className="text-2xl font-bold">ZUNI CLIENT</h1>
    <div className="flex items-center gap-4">
      <span>Hello uit!</span>
      <div className="rounded-full w-10 h-10 bg-purple-200 flex items-center justify-center">
        🪪
      </div>
    </div>
  </div>
);

const ShowDegree = () => {
  const degrees = [
    {
      id: 1,
      studentId: "19110001",
      name: "Trần Bảo Anh",
      dob: "11/8/2001",
      faculty: "Faculty of Information Technology",
      major: "Information Technology",
      classification: "Ordinary",
      mode: "Full-time",
      year: 2023,
      issueDate: "4/1/2023",
      serial: "1033548",
      ref: "BL42/AF",
    },
    // ... (Các dòng khác tương tự)
  ];

  return (
    <table className="min-w-full border mt-6">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">No</th>
          <th className="border p-2">Student ID</th>
          <th className="border p-2">Name</th>
          <th className="border p-2">Date of birth</th>
          <th className="border p-2">Faculty</th>
          <th className="border p-2">Major</th>
          <th className="border p-2">Degree classification</th>
          <th className="border p-2">Mode of study</th>
          <th className="border p-2">Year graduation</th>
          <th className="border p-2">Date of issue</th>
          <th className="border p-2">Serial number</th>
          <th className="border p-2">Reference number</th>
        </tr>
      </thead>
      <tbody>
        {degrees.map((deg, i) => (
          <tr key={deg.id} className="hover:bg-gray-50">
            <td className="border p-2 text-center">{i + 1}</td>
            <td className="border p-2">{deg.studentId}</td>
            <td className="border p-2">{deg.name}</td>
            <td className="border p-2">{deg.dob}</td>
            <td className="border p-2">{deg.faculty}</td>
            <td className="border p-2">{deg.major}</td>
            <td className="border p-2">{deg.classification}</td>
            <td className="border p-2">{deg.mode}</td>
            <td className="border p-2">{deg.year}</td>
            <td className="border p-2">{deg.issueDate}</td>
            <td className="border p-2">{deg.serial}</td>
            <td className="border p-2">{deg.ref}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const UploadDegree = () => (
  <div className="p-4">
    <p className="text-gray-600">Upload form goes here (chưa implement 😄).</p>
  </div>
);

export default function HomeIssuer() {
  const [sideTab, setSideTab] = useState("degree"); // info | degree
  const [mainTab, setMainTab] = useState("show"); // show | upload

  const renderMainContent = () => {
    if (sideTab === "info") {
      return <div className="p-6 text-gray-700">This is Info tab content.</div>;
    }
    return (
      <div className="p-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setMainTab("show")}
            className={`px-4 py-2 rounded-md ${
              mainTab === "show"
                ? "bg-gray-300"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Show Degree
          </button>
          <button
            onClick={() => setMainTab("upload")}
            className={`px-4 py-2 rounded-md ${
              mainTab === "upload"
                ? "bg-gray-300"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Upload Degree
          </button>
        </div>
        {mainTab === "show" ? <ShowDegree /> : <UploadDegree />}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar selectedTab={sideTab} onSelectTab={setSideTab} />
        <div className="flex-1 bg-gray-50 overflow-auto">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}
