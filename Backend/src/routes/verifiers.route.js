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

router.get(
  "/proofs",
  verifierMiddleware,
  verifierController.getAllSummittedProofsController
);

// router.post(
//   "/verify",
//   verifierMiddleware,
//   verifierController.verifyProofController
// );

router.put(
  "/update-proof-status",
  verifierMiddleware,
  verifierController.updateProofVerificationStatusController
);

module.exports = router;
