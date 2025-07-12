const bcrypt = require("bcryptjs");
const userModel = require("../models/users.model.js"); // Import model User
module.exports = { addUser, login, getUserById, changePassword };

// Đăng ký user
async function addUser(data) {
  try {
    
    const { name, email, password, repassword, role } = data;


    if (password !== repassword) {
      throw new Error("Mật khẩu nhập lại không khớp!");
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Lỗi trong addUser:", error);  // Log chi tiết lỗi
    throw error;  // Ném lỗi gốc lên trên để router xử lý
  }
}

  // Đăng nhập user
  async function login(data) {
    try {
      const { email, password } = data;
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error("Email chưa được đăng ký");
      }
      console.log("Password nhập:", password);
      console.log("Password mã hóa trong DB:", user.password);
      // So sánh mật khẩu đã mã hóa
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Sai mật khẩu");
      }

      // Nếu đăng nhập thành công, trả về thông tin người dùng
      // Ẩn mật khẩu khi trả về
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    } catch (error) {
      console.log("Lỗi đăng nhập:", error);
      throw new Error("Lỗi đăng nhập");
    }
  }
  // Lấy thông tin người dùng theo ID
  async function getUserById(id) {
    try {
      const user = await userModel.findById(id);
      if (!user) {
        throw new Error("Người dùng không tồn tại");
      }

      // Ẩn mật khẩu khi trả về
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    } catch (error) {
      console.log("Lỗi lấy thông tin người dùng:", error);
      throw new Error("Lỗi lấy thông tin người dùng");
    }
  }
  //đổi mật khẩu
  async function changePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await userModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
      if (!user) {
        throw new Error("Người dùng không tồn tại");
      }
      // Ẩn mật khẩu khi trả về
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    } catch (error) {
      console.log("Lỗi đổi mật khẩu:", error);
      throw new Error("Lỗi đổi mật khẩu");
    }
  }

