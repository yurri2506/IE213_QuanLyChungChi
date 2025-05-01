const express = require("express");
const router = express.Router();

const holderController = require("../controllers/holders.controller");
const { holderMiddleware } = require("../middleware/auth.middleware");

router.get(
  "/get-details",
  holderMiddleware,
  holderController.getHolderProfileController
);

// Lấy các bằng cấp đã nhận
router.get("/degrees", holderMiddleware, holderController.getDegreesController);

router.post(
  "/proofs/:degree_id",
  holderMiddleware,
  holderController.createProofController
);

// Gửi ZKP và tuyên bố đến verifier
router.post(
  "/verifiers/proofs/:verifierDID",
  holderMiddleware,
  holderController.sendProofToVerifierController
);

module.exports = router;
