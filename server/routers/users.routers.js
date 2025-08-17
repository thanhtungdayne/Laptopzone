const express = require('express');
const router = express.Router();
const userModel = require('../models/users.model.js');
const { updateUserInfo, login ,getCurrentUser} = require('../controllers/user.controller');
const verifyToken = require('../middleware/authMiddleware.js');
const userController = require('../controllers/user.controller.js');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, repassword, role } = req.body;
    const newUser = await userController.addUser({
      name,
      email,
      password,
      repassword,
      role,
    });
    return res.status(201).json({ status: true, newUser });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return res.status(500).json({ status: false, message: 'Lỗi đăng ký người dùng' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await login(req.body);
    console.log(req.body);
    res.json({ user: result.user, token: result.token, message: 'Đăng nhập thành công' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userController.getUserById(id);
    if (!user) {
      return res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
    }
    return res.status(200).json({ status: true, user });
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng:', error);
    return res.status(500).json({ status: false, message: 'Lỗi lấy thông tin người dùng' });
  }
});

router.put('/change-password/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: false, message: 'Mật khẩu cũ không đúng' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    return res.status(200).json({ status: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Lỗi đổi mật khẩu:', error);
    return res.status(500).json({ status: false, message: 'Lỗi đổi mật khẩu' });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    return res.status(200).json({ status: true, users });
  } catch (error) {
    console.error('Lỗi lấy tất cả người dùng:', error);
    return res.status(500).json({ status: false, message: 'Lỗi lấy tất cả người dùng' });
  }
});

router.put('/update/:id', verifyToken, updateUserInfo);
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;