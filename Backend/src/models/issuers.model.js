const mongoose = require("mongoose");

const issuerSchema = new mongoose.Schema(
  {
    issuer_id: { type: String, required: true, unique: true },
    hashed_password: { type: String, required: true },
    DID: { type: String, required: true, unique: true },
    encrypted_private_key: { type: String, required: true },
    name: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    role: { type: String, default: "ISSUER", enum: ["ISSUER"] },
  }
);

module.exports = mongoose.model("Issuers", issuerSchema);
