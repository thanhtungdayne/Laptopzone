const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true }, 
    email: { type: String, required: true }, 
    password: { type: String, required: true },
    role: { type: Number, required: true, default: 0 },
    phone: { type: String, required: false},
    address: { type: String, required: false },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);


module.exports = mongoose.models.user || mongoose.model('user', userSchema);