const mongoose = require("mongoose");

const issuerSchema = new mongoose.Schema({
  issuer_id: { type: String, required: true, unique: true },
  hashed_password: { type: String, required: true },
  DID: { type: String, required: true, unique: true },
  encrypted_private_key: { type: String, required: true },
  public_key: { type: String, required: true },
  name: { type: String, required: true },
  school_code: { type: String, required: true },
  symbol: { type: String, required: true },
  salt: { type: String, required: true },
  iv: { type: String, required: true },
  registration_tx_hash: { type: String },
  registed_DID: {
    type: String,
    enum: ["false", "pending", "true"],
    default: "false",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  role: { type: String, default: "ISSUER", enum: ["ISSUER"] },
});

module.exports = mongoose.model("Issuers", issuerSchema);
