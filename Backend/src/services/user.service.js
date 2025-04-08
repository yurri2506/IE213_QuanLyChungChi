const User = require("../models/user.model");

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      console.log("hi", allUser)
      return resolve({
        status: "OK",
        message: "Success 1",
        data: allUser,
      });
    } catch (e) {
      return reject(e);
    }
  });
};

module.exports = {
  getAllUser,
};
