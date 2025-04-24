const mongoose = require("mongoose");

const holder_ProofsSchema = new mongoose.Schema({
  holder_did: { type: String, required: true },
  issuer_did: { type: String, requrired: true },
  proof: { type: String, required: true },
  major: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Holder_Proofs", holder_ProofsSchema);
