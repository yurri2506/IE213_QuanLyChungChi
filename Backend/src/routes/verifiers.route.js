const express = require("express");
const router = express.Router();

const verifierController = require("../controllers/verifiers.controller");
const { verifierMiddleware } = require("../middleware/auth.middleware");

router.get(
  "/get-details",
  verifierMiddleware,
  verifierController.getVerifierProfileController
);

router.get("/check/:verifier_did", verifierController.checkVerifierController);

module.exports = router;
