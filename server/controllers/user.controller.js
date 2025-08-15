const bcrypt = require("bcryptjs");
const userModel = require("../models/users.model.js"); // Import model User
const jwt = require("jsonwebtoken");

module.exports = { addUser, login, getUserById, changePassword, getAllUsers, updateUserInfo };
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
      status: true, 
    });
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Lỗi trong addUser:", error);  // Log chi tiết lỗi
    throw error;  // Ném lỗi gốc lên trên để router xử lý
  }
}
//login
async function login(data) {
  try {
    
    const { email, password } = data;

    // Tìm user theo email
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("Email chưa được đăng ký");
    }

    // Kiểm tra status
    if (user.status !== true) {
      throw new Error("Tài khoản đã bị khóa hoặc chưa được kích hoạt");
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Sai mật khẩu");
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Trả về thông tin user (ẩn password) và token
    const userObj = user.toObject();
    delete userObj.password;
    return { user: userObj, token };
  } catch (error) {
    console.log("Lỗi đăng nhập:", error);
    throw new Error(error.message || "Lỗi đăng nhập");
  }
}

async function updateUserInfo(req, userId, body) {
  try {
    const { email, ...allowedFields } = body;

    const updateData = {};
    if (allowedFields.name) updateData.name = allowedFields.name;
    if (allowedFields.phone) updateData.phone = allowedFields.phone;
    if (allowedFields.address) updateData.address = allowedFields.address;
    if (allowedFields.dob) updateData.dob = allowedFields.dob;
    if (allowedFields.avatar) updateData.avatar = allowedFields.avatar;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Người dùng không tồn tại");
    }

    // Tạo token mới với thông tin user cập nhật
    const token = jwt.sign(
      {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Trả về thông tin user (ẩn password) và token mới
    const userObj = updatedUser.toObject();
    delete userObj.password;
    return { user: userObj, token };
  } catch (error) {
    console.error("Lỗi cập nhật thông tin người dùng:", error);
    throw new Error("Lỗi cập nhật thông tin người dùng");
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
  //lấy tất cả người dùng
async function getAllUsers() {
  try {
    const users = await userModel.find();
    return users.map(user => {
      const userObj = user.toObject();
      delete userObj.password; // Ẩn mật khẩu
      return userObj;
    });
  } catch (error) {
    console.error("Lỗi lấy tất cả người dùng:", error);
    throw new Error("Lỗi lấy tất cả người dùng");
  }
}
// thay đổi thông tin người dùng
async function updateUserInfo(req, userId, body) {
  try {
    const { email, ...allowedFields } = body;

    const updateData = {};
    if (allowedFields.name) updateData.name = allowedFields.name;
    if (allowedFields.phone) updateData.phone = allowedFields.phone;
    if (allowedFields.address) updateData.address = allowedFields.address;
    if (allowedFields.dob) updateData.dob = allowedFields.dob;
    if (allowedFields.avatar) updateData.avatar = allowedFields.avatar;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Người dùng không tồn tại");
    }

    // Tạo token mới với thông tin user cập nhật
    const token = jwt.sign(
      {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Trả về thông tin user (ẩn password) và token mới
    const userObj = updatedUser.toObject();
    delete userObj.password;
    return { user: userObj, token };
  } catch (error) {
    console.error("Lỗi cập nhật thông tin người dùng:", error);
    throw new Error("Lỗi cập nhật thông tin người dùng");
  }
}
