////:http://localhost:3000/product/
var express = require("express");
var router = express.Router();
const productController = require("../controllers/product.controller.js");
// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const checkfile = (req, file, cb) => {
//   if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
//     return cb(new Error("Vui lòng gửi file ảnh hợp lệ"), false);
//   }
//   cb(null, true);
// };

// const upload = multer({ storage: storage, fileFilter: checkfile });

//lấy tất cả sp
//http://localhost:3000/product/
router.get("/", async (req, res) => {
  try {
    const products = await productController.getAllPro(); // Lấy tất cả sản phẩm
    return res.status(200).json({ status: true, result: products });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});


//thêm dữ liệu
//http://localhost:3000/product/addpro
router.post("/addpro", async (req, res) => {
  try {
    const data = req.body;
    
    const newProduct = await productController.addProduct(data);
    return res.status(200).json({ status: true, newProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Lỗi thêm dữ liệu" });
  }
});


//Lấy sản phẩm mới
//http://localhost:3000/product/new-product
router.get("/new-product", async (req, res) => {
  try {
    const products = await productController.newProduct();
    return res.status(200).json({ status: true, result: products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Lỗi lấy dữ liệu" });
  }
});
//Lấy sản phẩm hot
//http://localhost:3000/product/hot-product
router.get("/hot-product", async (req, res) => {
  try {
    const products = await productController.hotProduct();
    return res.status(200).json({ status: true, result: products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Lỗi lấy dữ liệu" });
  }
});
//Lấy sản phẩm nhiều lượt xem
//http://localhost:3000/product/mostview
router.get("/mostview", async (req, res) => {
  try {
    const products = await productController.mostviewProduct();
    return res.status(200).json({ status: true, result: products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Lỗi lấy dữ liệu" });
  }
});
//Lấy sản phẩm theo danh mục
//http://localhost:3000/product/category/:id
router.get("/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await productController.getProductsByCategory(categoryId);
    return res.status(200).json({ status: true, result: products });
  } catch (error) {
    res.status(500).json({ status: false, message: "Lỗi lấy sản phẩm theo danh mục" });
  }
});
//Lấy theo id
//http://localhost:3000/product/detail/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pro = await productController.getDetailPro(id);
    
    return res.status(200).json({ status: true, pro });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Lỗi lấy dữ liệu" });
  }
});
//xóa dữ liệu
//http://localhost:3000/product/deletepro/..id
router.delete("/deletepro/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productController.deleteProduct(id);
    return res
      .status(200)
      .json({ status: true, message: "Xóa dữ liệu thành công" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Lỗi xóa dữ liệu" });
  }
});
//cập nhật dữ liệu
//http://localhost:3000/product/updatepro/..id
router.put("/updatepro/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
   
    const result = await productController.updateProduct(data, id);
    return res
      .status(200)
      .json({ status: true, result, message: "Cập nhật dữ liệu thành công" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Lỗi cập nhật dữ liệu" });
  }
});
module.exports = router;
