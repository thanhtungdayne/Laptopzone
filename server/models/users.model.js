const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true }, 
    email: { type: String, required: true }, 
    password: { type: String, required: true },
    role: { type: Number, required: true, default: 0 },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    dob: { type: Date, required: false, default: null}, // ngày sinh
    status: { type: Boolean, required: true, default: true },
    avatar: { 
      type: String, 
      default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.user || mongoose.model('user', userSchema);