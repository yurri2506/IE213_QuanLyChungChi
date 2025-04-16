const mongoose = require("mongoose");

const degreeSchema = new mongoose.Schema({
  holder_did: { type: String, required: true },
  issuer_did: { type: String, requrired: true },
  major: { type: String, required: true },
  faculty: { type: String, required: true },
  time_of_training: { type: Number, required: true },
  mode_of_study: { type: String },
  year_graduation: { type: String, required: true },
  classification: { type: String },
  serial_number: { type: String, required: true },
  reference_number: { type: String, required: true },
  date_of_issue: { type: Date, required: true },
  signature: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Degree", degreeSchema);
