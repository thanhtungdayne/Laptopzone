var express = require('express');
var router = express.Router();
const attributeController = require('../controllers/attribute.controller.js');
// Lấy tất cả thuộc tính 
// http://localhost:3000/attribute   
router.get('/', async (req, res) => {
    try {
        const attributes = await attributeController.getAllAttributes();
        return res.status(200).json({ status: true, attributes });
    } catch (error) {
        console.error("Lỗi lấy thuộc tính:", error);
        return res.status(500).json({ status: false, message: "Lỗi lấy thuộc tính" });
    }
});
// Thêm thuộc tính mới
// http://localhost:3000/attribute/addattribute
router.post('/addattribute', async (req, res) => {
    try {
        const newAttribute = await attributeController.addAttribute(req.body);
        return res.status(201).json({ status: true, newAttribute });
    } catch (error) {
        console.error("Lỗi thêm thuộc tính:", error);
        return res.status(500).json({ status: false, message: "Lỗi thêm thuộc tính" });
    }
});
// Cập nhật thuộc tính
// http://localhost:3000/attribute/updateattribute/:id
router.put('/updateattribute/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAttribute = await attributeController.updateAttribute(id, req.body);
        return res.status(200).json({ status: true, updatedAttribute });
    } catch (error) {
        console.error("Lỗi cập nhật thuộc tính:", error);
        return res.status(500).json({ status: false, message: "Lỗi cập nhật thuộc tính" });
    }
});
// Xóa thuộc tính
// http://localhost:3000/attribute/deleteattribute/:id
router.delete('/deleteattribute/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAttribute = await attributeController.deleteAttribute(id);
        return res.status(200).json({ status: true, deletedAttribute });
    } catch (error) {
        console.error("Lỗi xóa thuộc tính:", error);
        return res.status(500).json({ status: false, message: "Lỗi xóa thuộc tính" });
    }
});
module.exports = router;