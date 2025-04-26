const mongoose = require("mongoose");

const holderSchema = new mongoose.Schema({
  holder_id: { type: String, required: true, unique: true },
  hashed_password: { type: String, required: true },
  DID: { type: String, required: true, unique: true },
  encrypted_private_key: { type: String, required: true },
  salt: { type: String, required: true },
  iv: { type: String, required: true },
  name: { type: String, required: true },
  citizen_id: { type: String, required: true, unique: true },
  gender: { type: String, required: true, enum: [0, 1, 2] }, // 0: Nam, 1: Nữ, 2: Khác
  date_of_birth: { type: Date, required: true },
  place_of_birth: { type: String, required: true },
  address: { type: String, default: "N/A" },
  major: { type: String, required: true },
  faculty: { type: String, required: true },
  time_of_training: { type: Number, required: true },
  mode_of_study: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  role: { type: String, default: "HOLDER", enum: ["HOLDER"] },
});

module.exports = mongoose.model("Holder", holderSchema);
