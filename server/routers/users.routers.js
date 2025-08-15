var express = require("express");
var router = express.Router();
const userModel = require("../models/users.model.js");

const userController = require("../controllers/user.controller.js");
const { updateUserInfo,login } = require("../controllers/user.controller");
const bcrypt = require("bcryptjs");
// Đăng ký người dùng
router.post("/register", async (req, res) => {
   
  try {
    // Gửi nguyên bản password vào controller, KHÔNG mã hóa ở đây
    const { name, email, password,repassword, role } = req.body;
    const newUser = await userController.addUser({
      name,
      email,
      password,
      repassword,
      role,
    });
    return res.status(201).json({ status: true, newUser });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return res
      .status(500)
      .json({ status: false, message: "Lỗi đăng ký người dùng" });
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
// Đăng nhập người dùng
// router.post('/login', async (req, res) => {
//   try {
//     const result = await login(req.body);
//     res.json({ user: result.user, token: result.token, message: 'Đăng nhập thành công' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
// Lấy thông tin người dùng theo ID
router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userController.getUserById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Người dùng không tồn tại" });
    }
    return res.status(200).json({ status: true, user });
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng:", error);
    return res
      .status(500)
      .json({ status: false, message: "Lỗi lấy thông tin người dùng" });
  }
});
//đổi mật khẩu
router.put("/change-password/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Lấy user trực tiếp từ model để có trường password
    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Người dùng không tồn tại" });
    }
    console.log("User:", user);
    console.log("Old password nhập:", oldPassword);
    console.log("Password trong DB:", user.password);
    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Mật khẩu cũ không đúng" });
    }

    // Mã hóa mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới
    user.password = hashedNewPassword;
    await user.save();

    return res
      .status(200)
      .json({ status: true, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    return res.status(500).json({ status: false, message: "Lỗi đổi mật khẩu" });
  }
});
// Lấy tất cả người dùng
router.get("/", async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    return res.status(200).json({ status: true, users });
  } catch (error) {
    console.error("Lỗi lấy tất cả người dùng:", error);
    return res.status(500).json({ status: false, message: "Lỗi lấy tất cả người dùng" });
  }
});
// Cập nhật thông tin người dùng
 // Middleware kiểm tra JWT token
   const verifyToken = (req, res, next) => {
     const token = req.headers.authorization?.split(' ')[1];
     if (!token) {
       return res.status(401).json({ message: 'Vui lòng đăng nhập' });
     }
     try {
       const decoded = jwt.verify(token, JWT_SECRET);
       req.user = decoded;
       next();
     } catch (error) {
       return res.status(401).json({ message: 'Token không hợp lệ' });
     }
   };

   // Route login (KHÔNG dùng verifyToken)
 

   router.post('/update/:id', verifyToken, async (req, res) => {
     try {
       const userId = req.params.id;
       if (req.user.id !== userId) {
         return res.status(403).json({ message: 'Không có quyền' });
       }
       const result = await updateUserInfo(req, userId, req.body);
       res.json({ user: result.user, token: result.token, message: 'Cập nhật thành công' });
     } catch (error) {
       res.status(400).json({ message: error.message });
     }
   });

module.exports = router;
