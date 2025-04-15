const express = require("express");
const router = express.Router();

const holderController = require("../controllers/holders.controller");
const { holderMiddleware } = require("../middleware/auth.middleware");

router.get("/get-details", holderMiddleware,  holderController.getHolderProfileController);


module.exports = router;