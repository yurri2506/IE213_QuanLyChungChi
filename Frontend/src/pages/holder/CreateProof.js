import React, { useState } from "react";
import NavigationHolder from "../../components/Holder/NavigationHolder.js";
import { Helmet } from "react-helmet";

const CreateProof = () => {
  const [did, setDid] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [created, setCreated] = useState(false);

  const certificates = [
    { id: "cert1", name: "Bachelor of IT" },
    { id: "cert2", name: "Blockchain Training" },
  ];

  const handleVerify = () => {
    if (did.trim() !== "") {
      // Giả sử kiểm tra DID thành công
      setIsVerified(true);
    } else {
      alert("Vui lòng nhập DID hợp lệ.");
    }
  };

  const handleGenerateProof = () => {
    // if (selectedCert) {
    //   alert("Đã gửi proof ");
    // } else {
    //   alert("Vui lòng chọn một chứng chỉ.");
    // }
  };

  return (
    <NavigationHolder>
      <Helmet>
        <title>Tạo proof</title>
      </Helmet>
      <h1 className="font-bold text-2xl mt-10 ml-10 ">Create Proof</h1>
      <div className=" m-10 p-10 rounded-xl shadow-lg space-y-6">
        {/* Nhập DID + nút kiểm tra */}
        <div className="flex gap-2 items-center  justify-between">
          <input
            placeholder="Nhập DID..."
            value={did}
            onChange={(e) => setDid(e.target.value)}
            className=" flex-grow p-2 rounded-md border-2 border-gray-400 focus:outline-none focus:border-blue-500 "
          />
          <button
            onClick={handleVerify}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold"
          >
            Kiểm tra
          </button>
        </div>

        {/* Hiện danh sách chứng chỉ nếu đã kiểm tra */}
        {isVerified && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Danh sách chứng chỉ</h2>
            <div className="space-y-2 ml-4">
              {certificates.map((cert) => (
                <label
                  key={cert.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="certificate"
                    value={cert.id}
                    checked={selectedCert?.id === cert.id}
                    onChange={() => setSelectedCert(cert)}
                  />
                  <span>{cert.name}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleGenerateProof}
              className="bg-blue-600 hover:bg-blue-700  px-4 py-2 rounded-lg text-white font-semibold"
            >
              Generate Proofs
            </button>
          </div>
        )}
      </div>
    </NavigationHolder>
  );
};

export default CreateProof;
