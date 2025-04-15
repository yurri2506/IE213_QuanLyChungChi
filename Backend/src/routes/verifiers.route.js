const express = require("express");
const router = express.Router();

const verifierController = require("../controllers/verifiers.controller");
const { verifierMiddleware } = require("../middleware/auth.middleware");

router.get("/get-details", verifierMiddleware,  verifierController.getVerifierProfileController);


module.exports = router;