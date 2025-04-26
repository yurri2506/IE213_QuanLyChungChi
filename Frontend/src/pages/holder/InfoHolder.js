import React, { useState, useEffect } from "react";
import NavigationHolder from "../../components/Holder/NavigationHolder.js";
import { Helmet } from "react-helmet";
import { getUserInfo } from "../../services/apiHolder.js";
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

function formatDate(isoDateString) {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày, thêm '0' nếu nhỏ hơn 10
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (bắt đầu từ 0)
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatGender(string) {
  if (string === "0") return "Nam";
  if (string === "1") return "Nữ";
}

const Info = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await getUserInfo();
      if (response) {
        setUser(response.data);
        console.log("User info:", response.data);
      } else {
        console.error("Error fetching user info:", response.message);
      }
    };
    fetchUserInfo();
  }, []);

  //  const user = {
  //     studentId: "19110004",
  //     citizenId: "35790808174",
  //     name: "Trịnh Gia Bảo",
  //     gender: "Male",
  //     did: "0701fb8cbdef7b23f8d9703ad2b5eaf09de741db5c4f6370d0b872d0de95f9a",
  //     dateOfBirth: "7/19/2001",
  //     placeOfBirth: "Cần Thơ",
  //     address: "Bld Mihail Kogălniceanu, nr. 8 Bl 1, Sc 1, Ap 09",
  // };

  const infoFields = [
    { label: "Student ID", value: user.holder_id },
    { label: "Decentralized Identifier (DID)", value: user.DID, isDID: true },
    { label: "Name", value: user.name },
    { label: "Date of Birth", value: formatDate(user.date_of_birth) },
    { label: "Citizen ID", value: user.citizen_id },
    { label: "Place of Birth", value: user.place_of_birth },
    { label: "Gender", value: formatGender(user.gender) },
    { label: "Address", value: user.address },
  ];

  return (
    <NavigationHolder>
      <Helmet>
        <title>Holder</title>
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
    </NavigationHolder>
  );
};

export default Info;
