import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getIssuer } from "../services/api";

const Home = () => {
  const [did, setDid] = useState("");
  const [issuer, setIssuer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!did.trim()) {
      setError("Please enter a DID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getIssuer(did);
      console.log(response.data);

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
        setError("No issuer found with this DID");
      }
    } catch (err) {
      setError("Error fetching issuer data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderIssuerInfo = () => {
    if (!issuer) return null;

    return (
      <div className="card mt-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Issuer Found</h5>
        </div>
        <div className="card-body">
          <p>
            <strong>DID:</strong> {did}
          </p>
          <p>
            <strong>Name:</strong> {issuer.name || "Not specified"}
          </p>
          <p>
            <strong>Symbol:</strong> {issuer.symbol || "Not specified"}
          </p>
          <p>
            <strong>Public Key:</strong> {issuer.pubKey || ""}
          </p>
          <div className="mt-3">
            <Link to={`/issuer/${did}`} className="btn btn-primary">
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* <div className="jumbotron bg-light p-5 rounded">
        <h1 className="display-4">DID Registry</h1>
        <p className="lead">
          Welcome to the Decentralized Identifier (DID) Registry. This
          application allows you to register and manage DIDs on the blockchain.
        </p>
        <hr className="my-4" />
        <p>
          Use the search below to find information about a registered issuer, or
          navigate to other sections using the navigation bar.
        </p>
      </div> */}

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
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
                {error && <div className="alert alert-danger">{error}</div>}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          {renderIssuerInfo()}
          {!issuer && !loading && !error && (
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Quick Links</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <Link to="/register" className="btn btn-outline-primary">
                    Register a new Issuer
                  </Link>
                  <Link to="/waiting-list" className="btn btn-outline-primary">
                    View Waiting List
                  </Link>
                  <Link to="/remove-issuer" className="btn btn-outline-primary">
                    Remove an Issuer
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
