const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    user_name: { type: String}, 
    full_name: { type: String}, 
    user_password: { type: String, required: true }, 
    user_avt_img: { type: String }, 
    user_email: { type: String}, 
    user_phone: { type: String}, 
    user_birth: { type: Date }, 
    user_sex: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: "Nam" } ,
    is_delete : {type: Boolean, default: false}
  },
  {
    timestamps: true,
    collection: 'User'
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
