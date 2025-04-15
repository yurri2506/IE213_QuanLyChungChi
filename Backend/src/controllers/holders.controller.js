const holderService = require("../services/holders.service")

// Controller lấy thông tin Holder
const getHolderProfileController = async (req, res) => {
  try {
    const { sub } = req.user; // holder_id từ JWT
    const holder = await holderService.getHolderProfile(sub);
    res.status(200).json({
      message: "Holder profile retrieved successfully",
      data: { ...holder.toObject(), role: "HOLDER" },
    });
  } catch (error) {
    res.status(error.message === "Holder not found" ? 404 : 500).json({
      message: error.message,
      status: "ERROR",
    });
  }
};

module.exports = {
  getHolderProfileController,
};