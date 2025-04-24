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
  registed_DID: { type: String, require: true, default: "false" }, // Đăng ký DID trên blockchain false, pending, true
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  role: { type: String, default: "ISSUER", enum: ["ISSUER"] },
});

module.exports = mongoose.model("Issuers", issuerSchema);
