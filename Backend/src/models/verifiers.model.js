const mongoose = require("mongoose");

const verifierSchema = new mongoose.Schema({
  verifier_id: { type: String, required: true, unique: true },
  hashed_password: { type: String, required: true },
  DID: { type: String, required: true, unique: true },
  encrypted_private_key: { type: String, required: true },
  salt: { type: String, required: true },
  iv: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String }, // Tên viết tắt công ty
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  role: { type: String, default: "VERIFIER", enum: ["VERIFIER"] },
});

module.exports = mongoose.model("Verifier", verifierSchema);
