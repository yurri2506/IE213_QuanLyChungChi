import React, { useState, useEffect } from "react";
import NavigationHolder from "../../components/Holder/NavigationHolder.js";
import { Helmet } from "react-helmet";
import { checkVerifier } from "../../services/apiVerifier.js";
import Swal from "sweetalert2";
import {
  getDegreeInfo,
  generateProof,
  sendProof2Verifier,
} from "../../services/apiHolder.js";

const CreateProof = () => {
  const [verifier_DID, setVeriferDID] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [created, setCreated] = useState(false);
  const [degreeInfo, setDegreeInfo] = useState();
  const [proof, setProof] = useState("");
  const [major, setMajor] = useState("");
  const [issuerDID, setIssuerDID] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchDegreeInfo = async () => {
      const response = await getDegreeInfo();
      if (response) {
        setDegreeInfo(response.data);
        console.log("Degree info:", response.data);
      } else {
        console.error("Error fetching degree info:", response.message);
      }
    };
    fetchDegreeInfo();
  }, []);

  const certificates =
    degreeInfo?.map((cert, index) => ({
      id: cert._id,
      name: `${cert.major} - ${cert.classification} (${cert.year_graduation})`,
      full: cert, // lưu lại toàn bộ thông tin nếu cần
    })) || [];

  const handleSelectCert = (cert) => {
    setSelectedCert(cert);
    setCreated(false); // reset nếu đổi chứng chỉ
    setProof("");
    setMajor("");
    setIssuerDID("");
    setStatusMessage("");
  };

  const handleVerify = async () => {
    if (verifier_DID.trim() !== "") {
      const response = await checkVerifier(verifier_DID);
      console.log(response);
      response.data === true ? setIsVerified(true) : setIsVerified(false);
      if (response.data === false) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "The verifier DID does not exist",
        });
      }
    } else {
      alert("Vui lòng nhập DID hợp lệ.");
    }
  };

  const handleGenerateProof = async () => {
    if (!selectedCert) {
      alert("Vui lòng chọn một chứng chỉ.");
      return;
    }

    setLoading(true);
    setStatusMessage("Đang tạo proof...");

    const payload = {
      issuer_did: selectedCert.full.issuer_did,
      degree_id: selectedCert.full._id,
    };

    try {
      const response = await generateProof(payload);
      console.log(response.status);
      if (response.status === "SUCCESS") {
        setProof(response.data.proof);
        setMajor(response.data.major);
        setIssuerDID(response.data.issuer_did);
        setCreated(true);
        setStatusMessage("✅ Proof đã được tạo thành công!");
      } else {
        setStatusMessage("❌ Tạo proof thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo proof:", error);
      setStatusMessage("❌ Không thể tạo proof. Hãy thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendProof = async () => {
    if (!proof || !issuerDID || !major || !verifier_DID) {
      Swal.fire({
        icon: "error",
        title: "Thiếu dữ liệu",
        text: "Vui lòng chắc chắn đã chọn chứng chỉ, tạo proof và có DID của Verifier.",
      });
      return;
    }

    const payload = {
      issuer_did: issuerDID,
      proof: proof,
      major: major,
    };

    try {
      const result = await sendProof2Verifier(verifier_DID, payload);
      console.log(result);

      if (result.status === "SUCCESS") {
        Swal.fire({
          icon: "success",
          title: "Đã gửi proof!",
          text: "Proof đã được gửi thành công đến Verifier.",
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gửi thất bại",
          text: result.message || "Có lỗi xảy ra khi gửi proof.",
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi proof:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể gửi proof. Vui lòng thử lại sau.",
      });
    }
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
            value={verifier_DID}
            onChange={(e) => setVeriferDID(e.target.value)}
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
                    onChange={() => handleSelectCert(cert)}
                  />
                  <span>{cert.name}</span>
                </label>
              ))}
            </div>

            {/* Nút và trạng thái proof */}
            <div className="mt-4 space-y-2">
              {!created ? (
                <button
                  onClick={handleGenerateProof}
                  disabled={loading}
                  className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Đang tạo..." : "Generate Proofs"}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSendProof}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-semibold"
                  >
                    Gửi Proof
                  </button>
                  <div className="text-green-700 font-medium">
                    {statusMessage}
                  </div>
                </>
              )}

              {/* Hiện message luôn */}
              {!created && statusMessage && (
                <div className="text-gray-600 italic">{statusMessage}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </NavigationHolder>
  );
};

export default CreateProof;
