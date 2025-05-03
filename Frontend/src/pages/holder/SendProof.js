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

const SendProof = () => {
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
      alert("Please enter a valid DID.");
    }
  };

  const handleGenerateProof = async () => {
    if (!selectedCert) {
      alert("Please select a certificate.");
      return;
    }

    setLoading(true);
    setStatusMessage("Generating proof...");

    try {
      const response = await generateProof(selectedCert.full._id);
      console.log(response.status);
      if (response.status === "SUCCESS") {
        setProof(response.data.proof);
        setMajor(response.data.major);
        setIssuerDID(response.data.issuer_did);
        setCreated(true);
        setStatusMessage("✅ Proof generated successfully!");
      } else {
        setStatusMessage("❌ Failed to generate proof.");
      }
    } catch (error) {
      console.error("Error generating proof:", error);
      setStatusMessage("❌ Unable to generate proof. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendProof = async () => {
    if (!proof || !issuerDID || !major || !verifier_DID) {
      Swal.fire({
        icon: "error",
        title: "Missing Data",
        text: "Please ensure you have selected a certificate, generated a proof, and have the Verifier's DID.",
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
          title: "Proof Sent!",
          text: "Proof has been successfully sent to the Verifier.",
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Send Failed",
          text: result.message || "An error occurred while sending the proof.",
        });
      }
    } catch (error) {
      console.error("Error sending proof:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to send proof. Please try again later.",
      });
    }
  };

  return (
    <NavigationHolder>
      <Helmet>
        <title>Send proof</title>
      </Helmet>
      <h1 className="font-bold text-2xl mt-10 ml-10 ">Send Proof</h1>
      <div className=" m-10 p-10 rounded-xl shadow-lg space-y-6">
        {/* DID input + check button */}
        <div className="flex gap-2 items-center  justify-between">
          <input
            placeholder="Enter Verifier's DID..."
            value={verifier_DID}
            onChange={(e) => setVeriferDID(e.target.value)}
            className=" flex-grow p-2 rounded-md border-2 border-gray-400 focus:outline-none focus:border-blue-500 "
          />
          <button
            onClick={handleVerify}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold"
          >
            Check
          </button>
        </div>

        {/* Show certificate list if verified */}
        {isVerified && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Certificate List</h2>
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

            {/* Proof button and status */}
            <div className="mt-4 space-y-2">
              {!created ? (
                <button
                  onClick={handleGenerateProof}
                  disabled={loading}
                  className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Generating..." : "Generate Proof"}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSendProof}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-semibold"
                  >
                    Send Proof
                  </button>
                  <div className="text-green-700 font-medium">
                    {statusMessage}
                  </div>
                </>
              )}

              {/* Always show message */}
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

export default SendProof;
