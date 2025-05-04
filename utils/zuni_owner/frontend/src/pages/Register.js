import React, { useState } from "react";
import { registerIssuer } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    did: "",
    pubKey: "",
    signatureAlgorithm: "EdDSA",
    name: "",
    symbol: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.did || !formData.pubKey || !formData.signatureAlgorithm) {
      setError("DID, Public Key, and Signature Algorithm are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await registerIssuer(formData);
      setSuccess(
        `Successfully registered! Transaction hash: ${response.data.transactionHash}`
      );

      // Reset form after successful submission
      setFormData({
        did: "",
        pubKey: "",
        signatureAlgorithm: "EdDSA",
        name: "",
        symbol: "",
      });
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Error registering issuer");
      } else {
        setError("Error connecting to server");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Register Issuer</h2>

      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Registration Form</h5>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="did" className="form-label">
                DID *
              </label>
              <input
                type="text"
                className="form-control"
                id="did"
                name="did"
                value={formData.did}
                onChange={handleChange}
                placeholder="did:example:123"
                required
              />
              <div className="form-text">
                A unique identifier for the issuer
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="pubKey" className="form-label">
                Public Key *
              </label>
              <input
                type="text"
                className="form-control"
                id="pubKey"
                name="pubKey"
                value={formData.pubKey}
                onChange={handleChange}
                placeholder="0x..."
                required
              />
            </div>

            {/* <div className="mb-3">
              <label htmlFor="signatureAlgorithm" className="form-label">
                Signature Algorithm *
              </label>
              <input
                type="text"
                className="form-control"
                id="signatureAlgorithm"
                name="signatureAlgorithm"
                value={formData.signatureAlgorithm}
                onChange={handleChange}
                placeholder="ES256K"
                required
              />
            </div> */}

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Organization Name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="symbol" className="form-label">
                Symbol
              </label>
              <input
                type="text"
                className="form-control"
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                placeholder="ORG"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Issuer"}
            </button>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Registration Process</h5>
        </div>
        <div className="card-body">
          <p>
            When you register as an issuer, your information will be submitted
            to the blockchain and will be pending approval by the registry
            owner. After registration, your DID will appear in the waiting list.
          </p>
          <p>The registration process works as follows:</p>
          <ol>
            <li>Submit your issuer information through this form</li>
            <li>Your DID will be added to the waiting list</li>
            <li>The registry owner will review your information</li>
            <li>
              Once approved, your DID will be registered as an official issuer
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Register;
