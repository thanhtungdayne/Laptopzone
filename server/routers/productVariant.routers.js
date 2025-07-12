var express = require("express");
var router = express.Router();
const productVariantController = require("../controllers/productVariant.controller.js");

// Lấy tất cả biến thể sản phẩm
// http://localhost:3000/product-variant/
router.get("/", async (req, res) => {
  try {
    const variants = await productVariantController.getAllVariants();
    return res.status(200).json({ status: true, variants });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Lỗi lấy dữ liệu" });
  }
});
// Lấy biến thể sản phẩm theo ID
// http://localhost:3000/product-variant/by-product/:productId
router.get("/by-product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const variants = await productVariantController.getVariantByProductId(productId);
    return res.status(200).json({ status: true, result: variants });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Lỗi lấy dữ liệu" });
  }
});
// Thêm biến thể sản phẩm
// http://localhost:3000/product-variant/add
router.post("/add", async (req, res) => {
  try {
    const newVariant = await productVariantController.addVariant(req, res);
    return res.status(201).json({ status: true, variant: newVariant });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Lỗi thêm biến thể" });
  }
});
// Cập nhật biến thể sản phẩm
// http://localhost:3000/product-variant/update/:id
router.put("/update/:variantId", async (req, res) => {
  try {
    const updatedVariant = await productVariantController.updateVariantById(req);

    if (!updatedVariant) {
      return res.status(404).json({ status: false, message: "Không tìm thấy biến thể cần sửa" });
    }

    return res.status(200).json({ status: true, message: "Cập nhật thành công", variant: updatedVariant });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi cập nhật biến thể" });
  }
});
// Xóa biến thể sản phẩm
// http://localhost:3000/product-variant/delete/:variantId
router.delete('/delete/:variantId', async (req, res) => {
  const { variantId } = req.params;

  try {
    const result = await productVariantController.deleteVariantById(variantId);
    if (!result) {
      return res.status(404).json({ status: false, message: 'Không tìm thấy biến thể cần xóa' });
    }
    return res.status(200).json({ status: true, message: 'Xóa biến thể thành công', data: result });
  } catch (error) {
    console.error('Lỗi khi xóa biến thể:', error);
    return res.status(500).json({ status: false, message: 'Lỗi server khi xóa biến thể' });
  }
});
 module.exports = router;