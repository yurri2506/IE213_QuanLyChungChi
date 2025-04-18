import React from "react";
import NavigationHolder from "../../components/Holder/NavigationHolder.js";
import { FaAward, FaCheckCircle } from 'react-icons/fa';
import ZuniLogo from "../../assets/ZUNI.svg";

const studentInfo = {
  id: "19110004",
  name: "Trịnh Gia Bảo",
  dob: "7/19/2001",
  faculty: "Faculty of Information Technology",
  major: "Information Technology",
  classification: "average good",
  mode: "Full-time",
  issueDate: "4/1/2023",
  number: "1033548",
  registration: "BL42/AF"
};

const DegreeDetail = () => {
  return (
    <NavigationHolder>
      <div className="flex justify-center items-center w-full h-full bg-gray-100">
        <div className="bg-white border-2 border-blue-600 p-3 shadow-lg">
          <div className="bg-white border-2 border-blue-500 py-12 px-16 shadow-lg">
            <div className="flex text-center justify-center text-xs text-gray-700 font-semibold gap-20">
              {/* Cột tiếng Anh */}
              <div className="text-center relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-20 text-[300px] text-blue-300 pointer-events-none">
                  <FaAward />
                </div>
                <p>SOCIALIST REPUBLIC OF VIET NAM</p>
                <p className="underline">Independence - Freedom - Happiness</p>
                <div className="text-center my-8">
                  <h2 className="font-semibold uppercase text-xs">
                    VIET NAM NATIONAL UNIVERSITY HO CHI MINH CITY
                  </h2>
                  <h2 className="font-semibold uppercase text-xs">
                    UNIVERSITY OF INFORMATION TECHNOLOGY
                  </h2>
                  <p className="mt-6 italic text-xs">has conferred</p>
                  <h1 className="text-red-600 font-bold text-lg mt-2">THE DEGREE OF BACHELOR</h1>
                  <p className="uppercase font-semibold text-lg">in {studentInfo.major}</p>
                </div>
                <div className="justify-items-center text-xs">
                  <div className="text-left text-xs">
                    <p>Upon: <span className="font-semibold text-base ml-4">{studentInfo.name}</span></p>
                    <p>Date of birth: <span className="font-semibold ml-4">{studentInfo.dob}</span></p>
                    <p>Degree classification: <span className="font-semibold ml-2">{studentInfo.classification}</span></p>
                    <p>Mode of study: <span className="ml-2">{studentInfo.mode}</span></p>
                    <div className="mt-10 text-[10px] text-center">
                      <p>Ho Chi Minh City, {studentInfo.issueDate}</p>
                      <p>Given under the seal of</p>
                      <p className="font-semibold text-xs">UNIVERSITY OF TECHNOLOGY</p>
                    </div>
                  </div>
                </div>
                
              </div>
              {/* Cột tiếng Việt */}
              <div className="text-center relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-20 text-[300px] text-blue-300 pointer-events-none">
                  <FaAward />
                </div>
                <p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p className="underline">Độc lập - Tự do - Hạnh phúc</p>
                <div className="text-center my-8">
                  <h2 className="font-semibold uppercase text-xs">ĐẠI HỌC QUỐC GIA THÀNH PHỐ HỒ CHÍ MINH</h2>
                  <h2 className="font-semibold uppercase text-xs">TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN</h2>
                  <p className="mt-6 italic text-xs">cấp bằng</p>
                  <h1 className="text-red-600 font-bold text-lg mt-2">BẰNG CỬ NHÂN</h1>
                  <p className="uppercase font-semibold text-lg">{studentInfo.major.toUpperCase()}</p>
                </div>
                <div className="justify-items-center text-xs">
                  <div className="text-left pl-10 text-xs">
                    <p>Cho: <span className="font-semibold text-base ml-4">{studentInfo.name}</span></p>
                    <p>Ngày sinh: <span className="font-semibold ml-4">{studentInfo.dob}</span></p>
                    <p>Xếp loại tốt nghiệp: <span className="font-semibold ml-2">Trung bình khá</span></p>
                    <p>Hình thức đào tạo: <span className="font-semibold ml-2">Chính quy</span></p>
                    <div className="mt-10 text-[10px] italic text-right pr-8">
                      <p>Thành phố Hồ Chí Minh, {studentInfo.issueDate}</p>
                      <p className="font-semibold text-xs">HIỆU TRƯỞNG</p>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            <div className="flex flex-row mt-2 text-xs items-center ml-8">
              <img
                src="https://static.vnuhcm.edu.vn/images/0%20Phong%204T/Logo/2018.10.19%20-%20Co%20vien-05.png"
                alt="LogoVNU"
                className="w-20 h-20 mx-3"
              />
              <img
                src="https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-DH-Cong-Nghe-Thong-Tin-UIT-1024x828.png"
                alt="LogoUIT"
                className="w-20 p-3"
              />
              <div className="text-xs text-left ml-4">
                <p>Mã số SV ID: {studentInfo.id}</p>
                <p>Số hiệu No: {studentInfo.number}</p>
                <p>Số vào sổ cấp bằng Reg. No: {studentInfo.registration}</p>
              </div>
              <div className="border-t-2 border-black flex-grow mt-6 h-0 self-start ml-4"></div>
            </div>
          </div>
        </div>

        <div className="mx-8 p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center uppercase">Bachelor of Degree</h2>
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
              ["Registration number", studentInfo.registration]
            ].map(([label, value]) => (
              <p key={label} className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                <span className="font-semibold mr-1">{label}:</span> {value}
              </p>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center w-full max-w-full">
            <div className="flex gap-4 items-center">
              <img
                src="https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-DH-Cong-Nghe-Thong-Tin-UIT-1024x828.png"
                alt="Logo UIT"
                className="w-24 h-auto object-contain"
              />
              <img
                src={ZuniLogo}
                alt="Zuni Logo"
                className="w-24 h-24 object-contain"
              />
            </div>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${studentInfo.id}`}
              alt="QR"
              className="w-28 h-28 ml-5 border-2 border-green-300 rounded p-1 object-contain"
            />
          </div>
        </div>
      </div>
    </NavigationHolder>
  );
};

export default DegreeDetail;