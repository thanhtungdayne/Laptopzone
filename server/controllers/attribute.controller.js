const attributeModel = require('../models/attribute.model.js');
module.exports = {
    getAllAttributes,
    
    addAttribute,
    updateAttribute,
    deleteAttribute,
};
// Lấy tất cả các thuộc tính
async function getAllAttributes() {
    try {
        const result = await attributeModel.find().limit();
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi lấy dữ liệu');
    }
}
// Thêm thuộc tính mới
async function addAttribute(data) {
    try {
        const { name,values } = data;
        const newAttribute = new attributeModel({ name,values });
        const result = await newAttribute.save();
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi thêm thuộc tính');
    }
}
// Cập nhật thuộc tính
async function updateAttribute(id, data) {
    try {
        const { name,values } = data;
        const result = await attributeModel.findByIdAndUpdate(
            id,
            { name,values },
            { new: true }
        );      
        if (!result) {
            throw new Error('Không tìm thấy thuộc tính');
        }
        return result;
    }
    catch (error) {
        console.log(error);
        throw new Error('Lỗi cập nhật thuộc tính');
    }
}
// Xóa thuộc tính
async function deleteAttribute(id) {
    try {
        const result = await attributeModel.findByIdAndDelete(id);
        if (!result) {
            throw new Error('Không tìm thấy thuộc tính để xóa');
        }
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi xóa thuộc tính');
    }
}
