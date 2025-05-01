const express = require("express");
const router = express.Router();
const {
  registerIssuerController,
  registerHolderController,
  registerVerifierController,
  loginController,
  refreshTokenController,
} = require("../controllers/auth.controller");
const { issuerMiddleware } = require("../middleware/auth.middleware");

router.post("/issuers", registerIssuerController);
router.post("/holders", issuerMiddleware, registerHolderController);
router.post("/verifiers", registerVerifierController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);

module.exports = router;
