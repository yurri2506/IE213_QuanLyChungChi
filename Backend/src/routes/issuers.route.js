const express = require("express");
const router = express.Router();

const issuerController = require("../controllers/issuers.controller");
const { issuerMiddleware } = require("../middleware/auth.middleware");

router.get(
  "/get-details",
  issuerMiddleware,
  issuerController.getIssuerProfileController
);
router.post(
  "/degree",
  issuerMiddleware,
  issuerController.createDegreeController
);

router.get(
  "/degrees",
  issuerMiddleware,
  issuerController.getAllDegreesController
);

router.get(
  "/get-all-holder",
  issuerMiddleware,
  issuerController.getAllHolderController
);

// router.post(
//   "/register-did",
//   issuerMiddleware,
//   issuerController.registerDIDController
// );

router.post(
  "/update-registration-status",
  issuerController.updateRegistrationStatusController
);

module.exports = router;
