const express = require("express");
const router = express.Router();

const issuerController = require("../controllers/issuers.controller");
const { issuerMiddleware } = require("../middleware/auth.middleware");

router.get("/get-details", issuerMiddleware,  issuerController.getIssuerProfileController);


module.exports = router;