import React, { useState, useEffect } from "react";
import {
  getWaitingDIDs,
  acceptIssuer,
  declineIssuer,
  getIssuer,
} from "../services/api";
import axios from "axios";
const URL = process.env.REACT_APP_API_MAIN_URL || "http://localhost:3001/api";

const WaitingList = () => {
  const [waitingDIDs, setWaitingDIDs] = useState([]);
  const [issuerData, setIssuerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchWaitingList();
  }, []);

  const fetchWaitingList = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getWaitingDIDs();
      setWaitingDIDs(response.data.waitingDIDs || []);

      // Fetch details for each DID
      const issuerDetails = {};
      for (const did of response.data.waitingDIDs || []) {
        try {
          const issuerResponse = await getIssuer(did);
          const issuerInfo = issuerResponse.data.issuerInfo;

          // Convert array to object
          if (issuerInfo) {
            issuerDetails[did] = {
              isRegistered: issuerInfo[0],
              pubKey: issuerInfo[1],
              signatureAlgorithm: issuerInfo[2],
              name: issuerInfo[3],
              symbol: issuerInfo[4],
            };
          }
        } catch (err) {
          console.error(`Error fetching details for ${did}:`, err);
        }
      }

      setIssuerData(issuerDetails);
    } catch (err) {
      setError("Error fetching waiting list. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (did) => {
    setActionLoading((prev) => ({ ...prev, [did]: "accept" }));
    setError("");
    setSuccess("");

    try {
      const response = await acceptIssuer(did);
      setSuccess(
        `Successfully accepted issuer ${did}. Transaction hash: ${response.data.transactionHash}`
      );
      // const receipt = await response.wait();

      const rp = await axios.put(`${URL}/issuers/update-registration-status`, {
        issuer_did: did,
        status: "true",
      });

      console.log(rp);

      if (!rp.data.success) {
        throw new Error("Không thể cập nhật trạng thái đăng ký lên server");
      }
      // Remove from local list
      setWaitingDIDs((prev) => prev.filter((item) => item !== did));

      // Remove from issuer data
      const newIssuerData = { ...issuerData };
      delete newIssuerData[did];
      setIssuerData(newIssuerData);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Error accepting issuer");
      } else {
        setError("Error connecting to server");
      }
      console.error(err);
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[did];
        return newState;
      });
    }
  };

  const handleDecline = async (did) => {
    setActionLoading((prev) => ({ ...prev, [did]: "decline" }));
    setError("");
    setSuccess("");

    try {
      const response = await declineIssuer(did);
      setSuccess(
        `Successfully declined issuer ${did}. Transaction hash: ${response.data.transactionHash}`
      );
      // const receipt = await response.wait();

      const rp = await axios.pit(`${URL}/issuers/update-registration-status`, {
        issuer_did: did,
        status: "false",
      });

      console.log(rp);

      if (!rp.data.success) {
        throw new Error("Không thể cập nhật trạng thái đăng ký lên server");
      }
      // Remove from local list
      setWaitingDIDs((prev) => prev.filter((item) => item !== did));

      // Remove from issuer data
      const newIssuerData = { ...issuerData };
      delete newIssuerData[did];
      setIssuerData(newIssuerData);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Error declining issuer");
      } else {
        setError("Error connecting to server");
      }
      console.error(err);
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[did];
        return newState;
      });
    }
  };

  const renderIssuerDetails = (did) => {
    const issuer = issuerData[did];
    if (!issuer) return null;

    return (
      <div>
        {/* <p>
          <strong>Name:</strong> {issuer.name || "Not specified"}
        </p>
        <p>
          <strong>Symbol:</strong> {issuer.symbol || "Not specified"}
        </p>
        <p>
          <strong>Signature Algorithm:</strong> {issuer.signatureAlgorithm}
        </p>
        <p>
          <strong>Public Key:</strong>{" "}
          {issuer.pubKey ? `${issuer.pubKey.substring(0, 20)}...` : ""}
        </p> */}
      </div>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Waiting List</h2>
        <button
          className="btn btn-outline-primary"
          onClick={fetchWaitingList}
          disabled={loading}
        >
          Refresh List
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading waiting list...</p>
        </div>
      ) : waitingDIDs.length === 0 ? (
        <div className="alert alert-info">
          <p className="mb-0">No DIDs are currently waiting for approval.</p>
        </div>
      ) : (
        <div className="list-group">
          {waitingDIDs.map((did, index) => (
            <div key={did} className="list-group-item">
              <div className="d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                  <div>No. {index + 1}</div>
                  <div className="fw-bold">DID: {did}</div>
                </div>
                <div>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleAccept(did)}
                    disabled={actionLoading[did] === "accept"}
                  >
                    {actionLoading[did] === "accept"
                      ? "Accepting..."
                      : "Accept"}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDecline(did)}
                    disabled={actionLoading[did] === "decline"}
                  >
                    {actionLoading[did] === "decline"
                      ? "Declining..."
                      : "Decline"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card mt-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">About the Waiting List</h5>
        </div>
        <div className="card-body">
          <p>
            This page displays all DIDs that have registered as issuers but are
            waiting for approval. As the owner of this registry, you can approve
            or decline each registration request.
          </p>
          <p className="mb-0">
            <strong>Note:</strong> Only the contract owner can accept or decline
            issuers. These operations will fail if you're not using the owner's
            private key.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitingList;
