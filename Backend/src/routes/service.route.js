const express = require("express");
const { signDegreesController } = require("../controllers/signer.controller");

const router = express.Router();

router.post("/sign", signDegreesController);

module.exports = router;
