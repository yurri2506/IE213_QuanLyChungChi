import React, { useEffect, useState } from "react";
import NavigationIssuer from "../../components/Issuer/NavigationIssuer.js";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { decryptPrivateKey } from "../../utils/utils.js";
import { getAllHolder, getIssuerInfo } from "../../services/apiIssuer.js";
import { signupStudents } from "../../services/apiAuth.js";
import studentTemplate from "../../assets/dataStudent.example.json";
import AOS from "aos";
import "aos/dist/aos.css";

function formatGender(string) {
  if (string === "0") return "Nam";
  if (string === "1") return "Nữ";
}

function formatDateToDDMMYYYY(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày, thêm '0' nếu < 10
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// const formatDate = (dateObj) => {
//   const { day, month, year } = dateObj;
//   return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
// };

const shortenDID = (did) => {
  if (!did) return "";
  return `${did.slice(0, 20)}...${did.slice(-20)}`;
};

const handleCopy = (value) => {
  navigator.clipboard.writeText(value);
  alert("Copied to clipboard!");
};

export default function Students() {
  const [activeTab, setActiveTab] = useState("tab1");

  const persistRootRaw = sessionStorage.getItem("persist:root");
  const persistRoot = JSON.parse(persistRootRaw);
  const encryptedData =
    JSON.parse(persistRoot.encrypted_private_key) || "mã NÈ";
  const saltHex = JSON.parse(persistRoot.salt) || "mã NÈ";
  const ivHex = JSON.parse(persistRoot.iv) || "mã NÈ";
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHolders, setTotalHolders] = useState(0);
  const [students, setStudents] = useState([]);
  const [schoolCode, setSchoolCode] = useState();
  const [uploadedStudents, setuploadedStudents] = useState([]);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  const changeTab = (e) => {
    setActiveTab(e);
    if (e === "tab1") setPage(1); // reset về trang 1 khi quay lại
  };

  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian hiệu ứng (ms)
      once: true, // Chỉ chạy hiệu ứng một lần
    });
  }, []);

  const fetchIssuerInfo = async () => {
    try {
      const response = await getIssuerInfo();
      console.log(response);
      setSchoolCode(response.data.school_code);
      // localStorage.setItem("registed_DID", response.data.registed_DID)
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    fetchIssuerInfo();
  }, []);

  const fetchAllHolder = async () => {
    try {
      const response = await getAllHolder(page);
      setStudents(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalHolders(response.pagination.totalHolders);
      console.log(response);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    fetchAllHolder();
  }, [activeTab, page]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setuploadedStudents(data); // Cập nhật dữ liệu bằng cấp
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
    setuploadedStudents([]);
  };

  const handleSubmit = () => {
    setShowPasswordPopup(true); // hiển thị popup
  };

  const handleDownloadTemplate = () => {
    const json = JSON.stringify(studentTemplate, null, 2); // nếu muốn export dạng mảng
    const blob = new Blob([json], { type: "application/json" });

    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "students_template.json";
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

      // Thêm school_code vào từng JSON trong mảng uploadedStudents
      const studentsWithSchoolCode = uploadedStudents.map((student) => ({
        ...student,
        school_code: schoolCode, // Thêm school_code
      }));

      const response = await signupStudents(studentsWithSchoolCode);

      const total = uploadedStudents.length;
      const successCount = response.success.length;
      const failCount = response.failed.length;

      if (successCount === total) {
        //Tất cả đều thành công
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "All students have been registered successfully!",
        }).then(() => {
          window.location.reload();
        });
        setuploadedStudents([]);
      } else if (failCount === total) {
        // Tất cả đều thất bại
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          html: `
            <p>No students were registered.</p>
            <ul style="text-align: left;">
              ${response.failed
                .map(
                  (f) => `<li><strong>${f.holder_id}</strong>: ${f.error}</li>`
                )
                .join("")}
            </ul>
          `,
          confirmButtonColor: "#FF5733",
          width: "600px",
        });
      } else {
        //Một phần thành công, một phần thất bại
        Swal.fire({
          icon: "warning",
          title: "Partial Registration",
          html: `
            <p>${successCount} succeeded, ${failCount} failed.</p>
            <ul style="text-align: left;">
              ${response.failed
                .map(
                  (f) => `<li><strong>${f.holder_id}</strong>: ${f.error}</li>`
                )
                .join("")}
            </ul>
          `,
          confirmButtonColor: "#FFC107",
          width: "600px",
        });
      }

      setShowPasswordPopup(false);
      setPassword("");
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NavigationIssuer>
      <Helmet>
        <title>Student Management</title>
      </Helmet>
      {/* Navigation tab */}
      <div className="bg-gray-200 w-1/4 m-10 p-1 rounded-xl grid grid-cols-2 gap-1">
        <div
          className={`flex justify-center rounded-xl cursor-pointer transition-colors duration-500 ${
            activeTab === "tab1" ? "bg-white" : "bg-gray-200"
          }`}
          onClick={() => changeTab("tab1")}
        >
          <p>Show students</p>
        </div>
        <div
          className={`flex justify-center rounded-xl cursor-pointer transition-colors duration-500 ${
            activeTab === "tab2" ? "bg-white" : "bg-gray-200"
          }`}
          onClick={() => changeTab("tab2")}
        >
          <p>Student registration</p>
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
                    <th className="px-3 py-2">Place of birth</th>
                    <th className="px-3 py-2">Mode of study</th>
                    <th className="px-3 py-2">Time of training</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, index) => (
                    <tr
                      key={s.holder_id}
                      className="bg-white rounded-xl shadow-sm cursor-pointer hover:bg-blue-50"
                      onClick={() => {
                        setSelectedStudent(s);
                        setShowStudentModal(true);
                      }}
                    >
                      <td className="px-3 py-2 rounded-l-xl">{index + 1}</td>
                      <td className="px-3 py-2">{s.holder_id}</td>
                      <td className="px-3 py-2">{s.name}</td>
                      <td className="px-3 py-2">
                        {formatDateToDDMMYYYY(s.date_of_birth)}
                      </td>
                      <td className="px-3 py-2">{s.faculty}</td>
                      <td className="px-3 py-2">{s.major}</td>
                      <td className="px-3 py-2">{s.place_of_birth}</td>
                      <td className="px-3 py-2">{s.mode_of_study}</td>
                      <td className="px-3 py-2">{s.time_of_training}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalHolders === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg">
                  <p className="text-gray-600 text-lg font-semibold">
                    No students have been registered yet.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Please register students to see them here.
                  </p>
                </div>
              ) : (
                <div className="flex justify-end gap-4 items-center mt-4">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
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
            {uploadedStudents.length !== 0 ? null : (
              <div className=" justify-end flex">
                <button
                  onClick={handleDownloadTemplate}
                  className=" self-end flex text-blue-600 px-4 py-2 rounded hover:text-blue-800 hover:underline transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
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

            {uploadedStudents.length === 0 ? (
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
                    CLEAR
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    SUBMIT
                  </button>
                </div>
                <div className="flex justify-center bg-gray-100 p-4 rounded-lg">
                  <table className="min-w-full table-auto border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">No</th>
                        <th className="border px-2 py-1">Holder ID</th>
                        <th className="border px-2 py-1">Name</th>
                        <th className="border px-2 py-1">Citizen ID</th>
                        <th className="border px-2 py-1">Gender</th>
                        <th className="border px-2 py-1">Date of birth</th>
                        <th className="border px-2 py-1">Place of birth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedStudents.map((student, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="border px-2 py-1 text-center">
                            {index + 1}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {student.holder_id}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {student.name}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {student.citizen_id}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {formatGender(student.gender)}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {formatDateToDDMMYYYY(student.date_of_birth)}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {student.place_of_birth}
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

      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div
            className="bg-white w-[70%] relative max-w-5xl rounded-lg shadow-lg p-8 overflow-auto"
            data-aos="zoom-in"
          >
            <button
              className="absolute top-4 right-5 text-4xl font-bold text-gray-600 hover:text-gray-800"
              onClick={() => setShowStudentModal(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6">General Information</h2>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  value={selectedStudent.holder_id}
                  readOnly
                  className="bg-gray-100 p-3 rounded-lg border focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1">
                  Password (default)
                </label>
                <input
                  type="text"
                  value={"123456"}
                  readOnly
                  className="bg-gray-100 p-3 rounded-lg border focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1">
                  Decentralized Identifier (DID)
                </label>
                <div className="flex items-center bg-gray-100 p-3 rounded-lg border">
                  <span className="truncate">
                    {shortenDID(selectedStudent.DID)}
                  </span>
                  <button
                    className="ml-auto text-gray-600 hover:text-blue-600 active:scale-[0.98] text-sm"
                    onClick={() => handleCopy(selectedStudent.DID)}
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={selectedStudent.name}
                  readOnly
                  className="bg-gray-100 p-3 rounded-lg border focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  value={formatDateToDDMMYYYY(selectedStudent.date_of_birth)}
                  readOnly
                  className="bg-gray-100 p-3 rounded-lg border focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1">
                  Citizen ID
                </label>
                <input
                  type="text"
                  value={selectedStudent.citizen_id}
                  readOnly
                  className="bg-gray-100 p-3 rounded-lg border focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1">
                  Place of Birth
                </label>
                <input
                  type="text"
                  value={selectedStudent.place_of_birth}
                  readOnly
                  className="bg-gray-100 p-3 rounded-lg border focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1">
                  Gender
                </label>
                <input
                  type="text"
                  value={formatGender(selectedStudent.gender)}
                  readOnly
                  className="bg-gray-100 p-3 rounded-lg border focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={selectedStudent.address || "N/A"}
                  readOnly
                  className="bg-gray-100 p-3 rounded-lg border focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1">
                  Major
                </label>
                <input
                  type="text"
                  value={selectedStudent.major || "N/A"}
                  readOnly
                  className="bg-gray-100 p-3 rounded-lg border focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1">
                  Mode of study
                </label>
                <input
                  type="text"
                  value={selectedStudent.mode_of_study || "N/A"}
                  readOnly
                  className="bg-gray-100 p-3 rounded-lg border focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1">
                  Time of training
                </label>
                <input
                  type="text"
                  value={selectedStudent.time_of_training || "N/A"}
                  readOnly
                  className="bg-gray-100 p-3 rounded-lg border focus:outline-none"
                />
              </div>
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
