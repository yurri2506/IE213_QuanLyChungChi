import React, { use, useEffect } from "react";
import NavigationHolder from "../../components/Holder/NavigationHolder.js";
import { FaAward, FaCheckCircle } from "react-icons/fa";
import ZuniLogo from "../../assets/ZUNI.svg";
import LogoVNU from "../../assets/LogoVNU.png";
import LogoUIT from "../../assets/LogoUIT.png";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { getUserInfo } from "../../services/apiHolder.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import AOS from "aos";
import "aos/dist/aos.css";

function mapToVietnamese(field) {
  switch (field) {
    case "Very good":
      return "Xuất sắc";
    case "Full-time":
      return "Chính quy";
    case "Information Technology":
      return "Công nghệ thông tin";
    default:
      return field; // Trả về giá trị gốc nếu không tìm thấy
  }
}

function formatDate(isoDateString) {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày, thêm '0' nếu nhỏ hơn 10
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (bắt đầu từ 0)
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const DegreeDetail = () => {
  const location = useLocation();
  const { degree } = location.state || {}; // Lấy dữ liệu từ state
  const [userInfo, setUserInfo] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await getUserInfo();
      if (response) {
        setUserInfo(response.data);
        console.log("User info:", response.data);
      } else {
        console.error("Error fetching user info:", response.message);
      }
      setIsLoading(false);
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian hiệu ứng (ms)
      once: true, // Chỉ chạy hiệu ứng một lần
    });
  }, []);

  const studentInfo = {
    id: userInfo.holder_id || "N/A",
    name: userInfo.name || "N/A",
    dob: formatDate(userInfo.date_of_birth) || "N/A",
    faculty: degree.faculty,
    major: degree.major,
    classification: degree.classification,
    mode: degree.mode_of_study,
    issueDate: formatDate(degree.date_of_issue),
    number: degree.serial_number,
    registration: degree.reference_number,
  };

  // Hàm tải PDF
  const downloadPDF = () => {
    const element = document.getElementById("degree-content"); // ID của phần cần xuất PDF
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4"); // Chế độ ngang (landscape), đơn vị mm, kích thước A4
      const pdfWidth = pdf.internal.pageSize.getWidth(); // Chiều rộng trang PDF
      const pdfHeight = pdf.internal.pageSize.getHeight(); // Chiều cao trang PDF

      // Tính toán tỷ lệ để hình ảnh vừa khít trang A4
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);

      const imgWidth = canvasWidth * ratio;
      const imgHeight = canvasHeight * ratio;

      // Thêm hình ảnh vào PDF, căn giữa
      const xOffset = (pdfWidth - imgWidth) / 2; // Căn giữa theo chiều ngang
      const yOffset = (pdfHeight - imgHeight) / 2; // Căn giữa theo chiều dọc
      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);

      pdf.save("degree.pdf"); // Lưu file PDF
    });
  };
  return (
    <NavigationHolder>
      <Helmet>
        <title>Chi tiết văn bằng</title>
      </Helmet>
      <div className="flex justify-center items-center w-full h-full bg-gray-100">
        <div
          id={"degree-content"}
          className="bg-white border-2 border-blue-600 p-3 shadow-lg"
          data-aos="slide-right"
        >
          <div className="bg-white border-2 border-blue-500 py-12 px-16 shadow-lg">
            <div className="flex text-center justify-center text-xs text-gray-700 font-semibold gap-20">
              {/* Cột tiếng Anh */}
              <div className="text-center relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-20 text-[300px] text-blue-300 pointer-events-none z-0">
                  <FaAward />
                </div>
                <div className="relative z-10 text-black">
                  <p className="font-bold ">SOCIALIST REPUBLIC OF VIET NAM</p>
                  <p className="underline underline-offset-4 font-semibold">
                    Independence - Freedom - Happiness
                  </p>
                  <div className="text-center my-8 z-10">
                    <h2 className="font-semibold uppercase text-xs">
                      VIET NAM NATIONAL UNIVERSITY HO CHI MINH CITY
                    </h2>
                    <h2 className="font-semibold uppercase text-xs">
                      UNIVERSITY OF INFORMATION TECHNOLOGY
                    </h2>
                    <p className="mt-6 italic text-xs">has conferred</p>
                    <h1 className="text-red-600 font-bold text-lg mt-2">
                      THE DEGREE OF BACHELOR
                    </h1>
                    <p className="font-semibold text-lg">
                      in <span className="uppercase">{studentInfo.major} </span>
                    </p>
                  </div>
                  <div className="justify-items-center text-xs">
                    <div className="text-left text-xs">
                      <p>
                        Upon:{" "}
                        <span className="font-semibold text-base ml-4">
                          {studentInfo.name}
                        </span>
                      </p>
                      <p>
                        Date of birth:{" "}
                        <span className="font-semibold ml-4">
                          {studentInfo.dob}
                        </span>
                      </p>
                      <p>
                        Degree classification:{" "}
                        <span className="font-semibold ml-2">
                          {studentInfo.classification}
                        </span>
                      </p>
                      <p>
                        Mode of study:{" "}
                        <span className="ml-2">{studentInfo.mode}</span>
                      </p>
                      <div className="mt-10 text-[10px] text-center">
                        <p>Ho Chi Minh City, {studentInfo.issueDate}</p>
                        <p>Given under the seal of</p>
                        <p className="font-semibold text-xs">
                          UNIVERSITY OF TECHNOLOGY
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Cột tiếng Việt */}
              <div className="text-center relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-20 text-[300px] text-blue-300 pointer-events-none z-0">
                  <FaAward />
                </div>
                <div className="relative z-10 text-black">
                  <p className="font-bold">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </p>
                  <p className="underline underline-offset-4 font-semibold">
                    Độc lập - Tự do - Hạnh phúc
                  </p>
                  <div className="text-center my-8">
                    <h2 className="font-semibold uppercase text-xs">
                      ĐẠI HỌC QUỐC GIA THÀNH PHỐ HỒ CHÍ MINH
                    </h2>
                    <h2 className="font-semibold uppercase text-xs">
                      TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN
                    </h2>
                    <p className="mt-6 italic text-xs">cấp bằng</p>
                    <h1 className="text-red-600 font-bold text-lg mt-2">
                      BẰNG CỬ NHÂN
                    </h1>
                    <p className="uppercase font-semibold text-lg">
                      {mapToVietnamese(studentInfo.major)}
                    </p>
                  </div>
                  <div className="justify-items-center text-xs">
                    <div className="text-left pl-10 text-xs">
                      <p>
                        Cho:{" "}
                        <span className="font-semibold text-base ml-4">
                          {studentInfo.name}
                        </span>
                      </p>
                      <p>
                        Ngày sinh:{" "}
                        <span className="font-semibold ml-4">
                          {studentInfo.dob}
                        </span>
                      </p>
                      <p>
                        Xếp loại tốt nghiệp:{" "}
                        <span className="font-semibold ml-2">
                          {mapToVietnamese(studentInfo.classification)}
                        </span>
                      </p>
                      <p>
                        Hình thức đào tạo:{" "}
                        <span className="font-semibold ml-2">
                          {mapToVietnamese(studentInfo.mode)}
                        </span>
                      </p>
                      <div className="mt-10 text-[10px] italic text-right pr-8">
                        <p>Thành phố Hồ Chí Minh, {studentInfo.issueDate}</p>
                        <p className="font-semibold text-xs">HIỆU TRƯỞNG</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row mt-2 text-xs items-center ml-8">
              <img src={LogoVNU} alt="LogoVNU" className="w-20 h-20 mx-3" />
              <img src={LogoUIT} alt="LogoUIT" className="w-20 p-3" />
              <div className="text-xs text-left ml-4">
                <p>Mã số SV ID: {studentInfo.id}</p>
                <p>Số hiệu No: {studentInfo.number}</p>
                <p>Số vào sổ cấp bằng Reg. No: {studentInfo.registration}</p>
              </div>
              <div className="border-t-2 border-black flex-grow mt-6 h-0 self-start ml-4"></div>
            </div>
          </div>
        </div>

        <div
          className="mx-8 p-8 bg-white rounded-lg shadow-lg"
          data-aos="slide-left"
        >
          <h2 className="text-xl font-bold mb-4 text-center uppercase">
            Bachelor of Degree
          </h2>
          <div className="space-y-2 text-sm text-gray-800">
            {[
              ["Student Id", studentInfo.id],
              ["Name", studentInfo.name],
              ["Date of birth", studentInfo.dob],
              ["Faculty", studentInfo.faculty],
              ["Major", studentInfo.major],
              ["Degree classification", studentInfo.classification],
              ["Mode of study", studentInfo.mode],
              ["Date of issue", studentInfo.issueDate],
              ["Number", studentInfo.number],
              ["Registration number", studentInfo.registration],
            ].map(([label, value]) => (
              <p key={label} className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                <span className="font-semibold mr-1">{label}:</span> {value}
              </p>
            ))}
          </div>

          <div className="mt-6 flex justify-center items-center w-full max-w-full">
            <div className="flex gap-4 items-center">
              <img
                src={LogoUIT}
                alt="Logo UIT"
                className="w-24 h-auto object-contain"
              />
              <img
                src={ZuniLogo}
                alt="Zuni Logo"
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
          {/* Nút tải PDF */}
          <div className="mt-1 flex justify-center items-center w-full max-w-full">
            <button
              onClick={downloadPDF}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
            >
              Download Degree
            </button>
          </div>
        </div>
      </div>
    </NavigationHolder>
  );
};

export default DegreeDetail;
