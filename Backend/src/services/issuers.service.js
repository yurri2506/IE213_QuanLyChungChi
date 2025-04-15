const Issuer = require("../models/issuers.model")

// Lấy thông tin Issuer
const getIssuerProfile = async (issuer_id) => {
  const issuer = await Issuer.findOne({ issuer_id }).select("-hashed_password -encrypted_private_key");
  if (!issuer) {
    throw new Error("Issuer not found");
  }
  return issuer;
};

module.exports = {
  getIssuerProfile,
}