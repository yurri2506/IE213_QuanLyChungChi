const { signDegrees } = require("../services/signer.service");

async function signDegreesController(req, res) {
  try {
    const { privateKey, degrees } = req.body;

    if (!privateKey || !degrees || !Array.isArray(degrees)) {
      return res
        .status(400)
        .json({ error: "Missing privateKey or degrees array" });
    }

    const result = await signDegrees(privateKey, degrees);

    return res.json({
      success: true,
      data: result.signatures,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  signDegreesController,
};
