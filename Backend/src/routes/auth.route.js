const express = require("express");
const router = express.Router();
const {
  registerIssuerController,
  registerHolderController,
  registerVerifierController,
  loginController,
  refreshTokenController,
} = require("../controllers/auth.controller");

router.post("/issuers", registerIssuerController);
router.post("/holders", registerHolderController);
router.post("/verifiers", registerVerifierController);
router.post("/login", loginController);
router.post("/refresh-token",refreshTokenController);


module.exports = router;
