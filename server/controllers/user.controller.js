const bcrypt = require("bcryptjs");
const userModel = require("../models/users.model.js");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

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
    console.error("Lỗi trong addUser:", error);
    throw error;
  }
}

async function login(data) {
  const { email, password } = data;
  const user = await userModel.findOne({ email });
  if (!user) throw new Error("Email chưa được đăng ký");
  if (user.status !== true) throw new Error("Tài khoản bị khóa hoặc chưa kích hoạt");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Sai mật khẩu");
  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, token };
}

async function updateUserInfo(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, address, dob, avatar } = req.body;

    // Log debug
    console.log('[updateUserInfo] req.params:', req.params);
    console.log('[updateUserInfo] id:', id, '| typeof id:', typeof id);
    console.log('[updateUserInfo] req.user:', req.user);
    console.log('[updateUserInfo] req.body:', req.body);

    // Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `ID người dùng không hợp lệ: ${id}`,
      });
    }

    // Kiểm tra quyền
    if (!req.user || String(req.user.id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật thông tin người dùng này',
      });
    }

    // Không cho phép thay đổi email
    if (req.body.email) {
      return res.status(400).json({
        success: false,
        message: 'Không được phép thay đổi email',
      });
    }

    // Chỉ lấy các field cần update
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (dob) updateFields.dob = dob;
    if (avatar) updateFields.avatar = avatar;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại',
      });
    }

    delete updatedUser.password;

    return res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Lỗi cập nhật thông tin người dùng:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật thông tin người dùng',
      error: error.message,
    });
  }
}

async function getUserById(id) {
  try {
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  } catch (error) {
    console.log("Lỗi lấy thông tin người dùng:", error);
    throw new Error("Lỗi lấy thông tin người dùng");
  }
}

async function changePassword(id, newPassword) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await userModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  } catch (error) {
    console.log("Lỗi đổi mật khẩu:", error);
    throw new Error("Lỗi đổi mật khẩu");
  }
}

async function getAllUsers() {
  try {
    const users = await userModel.find();
    return users.map(user => {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    });
  } catch (error) {
    console.error("Lỗi lấy tất cả người dùng:", error);
    throw new Error("Lỗi lấy tất cả người dùng");
  }
}

async function getCurrentUser(req, res) {
  try {
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: `ID người dùng không hợp lệ: ${userId}`,
      });
    }

    const user = await userModel.findById(userId).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại',
      });
    }

    delete user.password;
    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng hiện tại:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin người dùng',
      error: error.message,
    });
  }
}

module.exports = { addUser, login, getUserById, changePassword, getAllUsers, updateUserInfo , getCurrentUser };