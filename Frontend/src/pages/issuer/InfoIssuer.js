import React from "react";
import { Helmet } from "react-helmet";
import NavigationIssuer from "../../components/Issuer/NavigationIssuer.js";

const InfoCard = ({ label, value }) => (
  <div className="">
    <p className="text-xs font-bold uppercase mb-1">{label}</p>
    <div className="bg-gray-50 shadow-md rounded-md p-2 text-base truncate overflow-hidden whitespace-nowrap text-ellipsis">
      {value}
    </div>
  </div>
);

export default function InfoIssuer() {
  const user = {
    studentId: "19110004",
    citizenId: "35790808174",
    name: "Trịnh Gia Bảo",
    gender: "Male",
    did: "0701fb8cbdef7b23f8d9703ad2b5eaf09de741db5c4f6370d0b872d0de95f9a",
    dateOfBirth: "7/19/2001",
    placeOfBirth: "Cần Thơ",
    address: "Bld Mihail Kogălniceanu, nr. 8 Bl 1, Sc 1, Ap 09",
  };

  const infoFields = [
    { label: "Student ID", value: user.studentId },
    { label: "Decentralized Identifier (DID)", value: user.did },
    { label: "Name", value: user.name },
    { label: "Date of Birth", value: user.dateOfBirth },
    { label: "Citizen ID", value: user.citizenId },
    { label: "Place of Birth", value: user.placeOfBirth },
    { label: "Gender", value: user.gender },
    { label: "Address", value: user.address },
  ];

  return (
    <NavigationIssuer>
      <Helmet>
        <title>Thông tin chủ sở hữu</title>
      </Helmet>
      <h1 className="font-bold text-2xl mt-10 ml-10 ">Your Infomation</h1>
      <div className="holder-info shadow-lg rounded-b-lg m-10 px-10 pb-10">
        <h2 className="text-xl font-bold mb-6">General Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {infoFields.map((item, index) => (
            <InfoCard key={index} label={item.label} value={item.value} />
          ))}
        </div>
      </div>
    </NavigationIssuer>
  );
}
