const {
  registerIssuer,
  registerHolder,
  registerVerifier,
  refreshToken,
  login,
} = require("../services/auth.service");

const registerIssuerController = async (req, res) => {
  try {
    const { issuer_id, password, name, school_code, symbol } = req.body;
    if (!issuer_id || !password || !name || !school_code || !symbol) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await registerIssuer({
      issuer_id,
      password,
      name,
      school_code,
      symbol,
    });
    res.status(201).json({
      message: "Issuer registered successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const registerHolderController = async (req, res) => {
  try {
    const {
      holder_id,
      password,
      name,
      citizen_id,
      gender,
      date_of_birth,
      place_of_birth,
      major,
      faculty,
      time_of_training,
      mode_of_study,
    } = req.body;

    if (
      !holder_id ||
      !password ||
      !name ||
      !citizen_id ||
      !gender ||
      !date_of_birth ||
      !place_of_birth ||
      !major ||
      !faculty ||
      !time_of_training ||
      !mode_of_study
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await registerHolder({
      holder_id,
      password,
      name,
      citizen_id,
      gender,
      date_of_birth,
      place_of_birth,
      major,
      faculty,
      time_of_training,
      mode_of_study,
    });

    res.status(201).json({
      message: "Holder registered successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const registerVerifierController = async (req, res) => {
  try {
    const { verifier_id, password, name, symbol } = req.body;
    if (!verifier_id || !password || !name || !symbol) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await registerVerifier({
      verifier_id,
      password,
      name,
      symbol,
    });
    res.status(201).json({
      message: "Verifier registered successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
      return res.status(400).json({ message: "Missing user_id or password" });
    }

    const result = await login(user_id, password);
    res.status(200).json({
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const refreshTokenController = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ message: "Missing refresh_token" });
    }

    const result = await refreshToken(refresh_token);
    res.status(200).json({
      message: "Token refreshed successfully",
      data: result,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  registerIssuerController,
  registerHolderController,
  registerVerifierController,
  loginController,
  refreshTokenController,
};
