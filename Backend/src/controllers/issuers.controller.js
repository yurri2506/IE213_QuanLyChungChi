const issuerService = require("../services/issuers.service");

// Controller lấy thông tin Issuer
const getIssuerProfileController = async (req, res) => {
  try {
    const { sub } = req.user; // issuer_id từ JWT
    const issuer = await issuerService.getIssuerProfile(sub);
    res.status(200).json({
      message: "Issuer profile retrieved successfully",
      data: { ...issuer.toObject(), role: "ISSUER" },
    });
  } catch (error) {
    res.status(error.message === "Issuer not found" ? 404 : 500).json({
      message: error.message,
      status: "ERROR",
    });
  }
};

const createDegree = async (req, res) => {
  try {
    const {
      holder_did,
      issuer_did,
      major,
      faculty,
      time_of_training,
      mode_of_study,
      year_graduation,
      classification,
      serial_number,
      reference_number,
      date_of_issue,
      signature,
    } = req.body;

    if (
      !holder_did ||
      !issuer_did ||
      !major ||
      !faculty ||
      !time_of_training ||
      !mode_of_study ||
      !year_graduation ||
      !classification ||
      !serial_number ||
      !reference_number ||
      !date_of_issue ||
      !signature
    )
      return res.status(400).json({ message: "Missing required fields" });

    const result = await issuerService.createDegree({
      holder_did,
      issuer_did,
      major,
      faculty,
      time_of_training,
      mode_of_study,
      year_graduation,
      classification,
      serial_number,
      reference_number,
      date_of_issue,
      signature,
    });

    if (result) {
      res.status(201).json({
        message: "Holder registered successfully",
        data: result,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getIssuerProfileController,
  createDegree,
};
