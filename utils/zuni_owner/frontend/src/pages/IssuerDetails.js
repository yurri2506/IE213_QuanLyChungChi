import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIssuer, removeIssuer } from "../services/api";

const IssuerDetails = () => {
  const { did } = useParams();
  const navigate = useNavigate();
  const [issuer, setIssuer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [reason, setReason] = useState("");
  const [removeLoading, setRemoveLoading] = useState(false);
  const [removeError, setRemoveError] = useState("");

  useEffect(() => {
    fetchIssuerDetails();
  }, [did]);

  const fetchIssuerDetails = async () => {
    setLoading(true);
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
        setError("This DID is not a registered issuer");
      }
    } catch (err) {
      setError("Error fetching issuer data. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      setRemoveError("Please provide a reason for removal");
      return;
    }

    setRemoveLoading(true);
    setRemoveError("");

    try {
      const response = await removeIssuer(did, reason);
      alert(
        `Issuer successfully removed. Transaction hash: ${response.data.transactionHash}`
      );
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data) {
        setRemoveError(err.response.data.error || "Error removing issuer");
      } else {
        setRemoveError("Error connecting to server");
      }
      console.error(err);
    } finally {
      setRemoveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading issuer details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-outline-danger"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Issuer Details</h2>
        <button
          className="btn btn-danger"
          onClick={() => setShowRemoveModal(true)}
        >
          Remove Issuer
        </button>
      </div>

      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">DID: {did}</h5>
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

          {/* <div className="row mb-3">
            <div className="col-md-3 fw-bold">Signature Algorithm:</div>
            <div className="col-md-9">{issuer.signatureAlgorithm}</div>
          </div> */}

          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Public Key:</div>
            <div className="col-md-9">
              <div className="text-break">{issuer.pubKey || ""}</div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Registered:</div>
            <div className="col-md-9">
              <span className="badge bg-success">Yes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Modal */}
      {showRemoveModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Remove Issuer</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRemoveModal(false)}
                ></button>
              </div>
              <form onSubmit={handleRemoveSubmit}>
                <div className="modal-body">
                  <p>
                    Are you sure you want to remove this issuer from the
                    registry?
                  </p>
                  <p>
                    <strong>DID:</strong> {did}
                  </p>

                  <div className="mb-3">
                    <label htmlFor="reason" className="form-label">
                      Reason for removal *
                    </label>
                    <textarea
                      className="form-control"
                      id="reason"
                      rows="3"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {removeError && (
                    <div className="alert alert-danger">{removeError}</div>
                  )}

                  <div className="alert alert-warning">
                    <strong>Note:</strong> This action can only be performed by
                    the contract owner and cannot be undone.
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowRemoveModal(false)}
                    disabled={removeLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={removeLoading}
                  >
                    {removeLoading ? "Processing..." : "Remove Issuer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuerDetails;
