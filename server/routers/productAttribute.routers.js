var express = require("express");
var router = express.Router();
const productAttributeController = require("../controllers/productAttribute.controller.js");
// Lấy tất cả thuộc tính sản phẩm
router.get("/", async (req, res) => {
    try {
        const productAttributes = await productAttributeController.getAllProductAttributes();
        return res.status(200).json({ status: true, result: productAttributes });
    } catch (error) {
        console.error("Lỗi:", error);
        return res.status(500).json({ status: false, message: "Lỗi lấy thuộc tính sản phẩm" });
    }
});
// Tạo thuộc tính sản phẩm mới
router.post("/add", async (req, res) => {
    try {
        const data = req.body;
        const newProductAttribute = await productAttributeController.createProductAttribute(data);
        return res.status(201).json({ status: true, result: newProductAttribute });
    } catch (error) {
        console.error("Lỗi:", error);
        return res.status(500).json({ status: false, message: "Lỗi tạo thuộc tính sản phẩm" });
    }
});
// Cập nhật thuộc tính sản phẩm
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedProductAttribute = await productAttributeController.updateProductAttribute(id, data);
        return res.status(200).json({ status: true, result: updatedProductAttribute });
    } catch (error) {
        console.error("Lỗi:", error);
        return res.status(500).json({ status: false, message: "Lỗi cập nhật thuộc tính sản phẩm" });
    }
});
// Xóa thuộc tính sản phẩm
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await productAttributeController.deleteProductAttribute(id);
        return res.status(200).json({ status: true, message: "Xóa thuộc tính sản phẩm thành công" });
    } catch (error) {
        console.error("Lỗi:", error);
        return res.status(500).json({ status: false, message: "Lỗi xóa thuộc tính sản phẩm" });
    }
});




module.exports = router;
