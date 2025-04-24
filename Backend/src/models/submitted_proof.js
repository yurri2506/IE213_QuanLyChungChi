const mongoose = require("mongoose");

const submitted_ProofsSchema = new mongoose.Schema({
  verifyr_did: { type: String, required: true },
  holder_did: { type: String, required: true },
  issuer_did: { type: String, requrired: true },
  issuer_name: { type: String, required: true },
  issuer_symbol: { type: String, required: true },
  is_verified: { type: Boolean, default: false },
  proof: { type: String, required: true },
  major: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submitted_Proof", submitted_ProofsSchema);
