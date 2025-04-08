const { response } = require("express")
const userService = require("../services/user.service")

const getAllUser =  async(req, res) =>{
  try {

      const response = await userService.getAllUser()
      console.log("hi")
      console.log(response)
      return res.status(200).json(response)
  } catch (error) {
      return res.status(500).json({
          status: 'ERROR',
          message: error.message
      })
  }
}

module.exports = {
  getAllUser,
}