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

const createDegreeController = async (req, res) => {
  try {
    const { sub } = req.user;
    const issuer = await issuerService.getIssuerProfile(sub);
    const issuer_did = issuer.DID;
    const school_code = issuer.school_code;

    const degrees = req.body; // array

    if (!Array.isArray(degrees) || degrees.length === 0) {
      return res.status(400).json({ message: "Degrees array is required" });
    }

    // Kiểm tra từng bằng xem có đủ thông tin không
    for (const degree of degrees) {
      const {
        holder_did,
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
      } = degree;

      if (
        !holder_did ||
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
      ) {
        return res
          .status(400)
          .json({ message: "Missing required fields in one or more degrees" });
      }
    }

    const result = await issuerService.createDegrees(
      school_code,
      degrees.map((degree) => ({
        ...degree,
        issuer_did,
      }))
    );

    res.status(201).json({
      status: "success",
      message: "Degrees registered successfully",
      data: result, // trả về mảng các ID hoặc object
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllDegreesController = async (req, res) => {
  try {
    const { sub } = req.user;
    const issuer = await issuerService.getIssuerProfile(sub);
    const issuer_did = issuer.DID;

    if (!issuer_did) {
      return res.status(400).json({ message: "issuer_did là bắt buộc" });
    }

    const degrees = await issuerService.getAllDegrees({ issuer_did });

    res.status(200).json({
      status: "SUCCESS",
      data: degrees,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

const getAllHolderController = async (req, res) => {
  try {
    const { page = 1 } = req.query; // Lấy số trang từ query params, mặc định là 1
    const { sub } = req.user;
    const issuer = await issuerService.getIssuerProfile(sub);
    const school_code = issuer.school_code;
    const result = await issuerService.getAllHolder(school_code, Number(page));

    res.status(200).json({
      status: "SUCCESS",
      data: result.holders,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error in getAllHoldersController:", error);
    res.status(500).json({
      status: "ERROR",
      message: error.message || "Internal server error",
    });
  }
};

// const registerDIDController = async (req, res) => {
//   try {
//     const { sub } = req.user;
//     const issuer = await issuerService.getIssuerProfile(sub);
//     const issuer_did = issuer.DID;
//     const public_key = issuer.public_key;
//     const name = issuer.name;
//     const symbol = issuer.symbol;

//     const result = await issuerService.registerDID({
//       issuer_did,
//       public_key,
//       name,
//       symbol,
//     });

//     res.status(result.success ? 200 : 400).json(result);
//   } catch (error) {
//     console.error("Error in registerDIDController:", error);
//     res.status(500).json({
//       message: error.message || "Internal server error",
//       status: "ERROR",
//     });
//   }
// };

const updateRegistrationStatusController = async (req, res) => {
  try {
    const { issuer_did, txHash, status } = req.body;

    const result = await issuerService.updateRegistrationStatus(
      issuer_did,
      status,
      txHash
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getIssuerProfileController,
  createDegreeController,
  getAllDegreesController,
  getAllHolderController,
  // registerDIDController,
  updateRegistrationStatusController,
};
