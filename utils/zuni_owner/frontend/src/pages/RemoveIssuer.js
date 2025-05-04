import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIssuer, removeIssuer } from "../services/api";
import axios from "axios";
const URL = process.env.REACT_APP_API_MAIN_URL || "http://localhost:3001/api";

const RemoveIssuer = () => {
  const navigate = useNavigate();
  const [did, setDid] = useState("");
  const [reason, setReason] = useState("");
  const [issuer, setIssuer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!did.trim()) {
      setError("Please enter a DID");
      return;
    }

    setSearchLoading(true);
    setError("");

    try {
      const response = await getIssuer(did);

      // Handle issuerInfo as array instead of object
      const issuerInfo = response.data.issuerInfo;

      if (issuerInfo && issuerInfo[0] === true) {
        // isRegistered is at index 0
        setIssuer({
          isRegistered: issuerInfo[0],
          pubKey: issuerInfo[1],
          signatureAlgorithm: issuerInfo[2],
          name: issuerInfo[3],
          symbol: issuerInfo[4],
        });
      } else {
        setIssuer(null);
        setError("No registered issuer found with this DID");
      }
    } catch (err) {
      setError("Error fetching issuer data");
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRemove = async (e) => {
    e.preventDefault();

    if (!did.trim() || !reason.trim()) {
      setError("Both DID and reason are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await removeIssuer(did, reason);
      setSuccess(
        `Successfully removed issuer. Transaction hash: ${response.data.transactionHash}`
      );
      setIssuer(null);
      setDid("");
      setReason("");
      const rp = await axios.put(`${URL}/issuers/update-registration-status`, {
        issuer_did: did,
        status: "false",
        txHash: response.data.transactionHash,
      });

      if (!rp.data.success) {
        throw new Error("Không thể cập nhật trạng thái đăng ký lên server");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Error removing issuer");
      } else {
        setError("Error connecting to server");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderIssuerInfo = () => {
    if (!issuer) return null;

    return (
      <div className="card mb-4">
        <div className="card-header bg-warning">
          <h5 className="mb-0">Issuer to Remove</h5>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Name:</div>
            <div className="col-md-9">{issuer.name || "Not specified"}</div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Symbol:</div>
            <div className="col-md-9">{issuer.symbol || "Not specified"}</div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Signature Algorithm:</div>
            <div className="col-md-9">{issuer.signatureAlgorithm}</div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Public Key:</div>
            <div className="col-md-9">
              <div className="text-break">
                {issuer.pubKey ? `${issuer.pubKey.substring(0, 40)}...` : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="mb-4">Remove Issuer</h2>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Search for Issuer</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="mb-3">
              <label htmlFor="didInput" className="form-label">
                DID
              </label>
              <input
                type="text"
                className="form-control"
                id="didInput"
                value={did}
                onChange={(e) => setDid(e.target.value)}
                placeholder="Enter DID to search"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={searchLoading}
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {renderIssuerInfo()}

      {issuer && (
        <div className="card">
          <div className="card-header bg-danger text-white">
            <h5 className="mb-0">Remove This Issuer</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleRemove}>
              <div className="mb-3">
                <label htmlFor="reason" className="form-label">
                  Reason for Removal *
                </label>
                <textarea
                  className="form-control"
                  id="reason"
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter the reason for removing this issuer"
                  required
                ></textarea>
              </div>

              <div className="alert alert-warning">
                <strong>Warning:</strong> This action can only be performed by
                the contract owner and cannot be undone. The issuer will be
                permanently removed from the registry.
              </div>

              <button
                type="submit"
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? "Processing..." : "Remove Issuer"}
              </button>
            </form>
          </div>
        </div>
      )}

      {!issuer && !error && (
        <div className="card">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">Instructions</h5>
          </div>
          <div className="card-body">
            <p>
              To remove an issuer from the registry, first search for their DID
              using the form above. Once found, you will be able to specify a
              reason and confirm the removal.
            </p>
            <p className="mb-0">
              <strong>Note:</strong> Only the contract owner can remove issuers
              from the registry.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoveIssuer;
