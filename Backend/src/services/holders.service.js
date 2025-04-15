const Holder = require("../models/holders.model")

// Lấy thông tin Holder
const getHolderProfile = async (holder_id) => {
  const holder = await Holder.findOne({ holder_id }).select("-hashed_password -encrypted_private_key");
  if (!holder) {
    throw new Error("Holder not found");
  }
  return holder;
};

module.exports = {
  getHolderProfile,
}
