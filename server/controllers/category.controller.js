//thực hiện thao tác CRUD với collection categories
const categoryModel = require('../models/category.model.js');

module.exports={getAllCate,getDetailCate,addCate,updateCate,deleteCate}

//lấy toàn bộ dữ liệu trong collection categories
async function getAllCate() {
    try{
        //find(); lấy toàn bộ dữ liệu trong collection
        const result =await categoryModel.find()
        return result
    }catch(error){
        console.log(error);
        throw new Error('Lỗi lấy dữ liệu')
    }
    
}
//Lấy chi tiết danh mục
async function getDetailCate(id){
    try{
        const result = await categoryModel.findById(id)
        return result

    }catch(error){
        console.log(error);
        throw new Error('Lỗi lấy dữ liệu')
        
    }
}

//thêm danh mục
async function addCate(data) {
    try {
        const { name, description } = data;
        const newCate = new categoryModel({
            name,
            description
        });
        await newCate.save(); // Lưu vào collection categories
        return newCate;
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi thêm dữ liệu');
    }
}
// Cập nhật danh mục
async function updateCate(id, data) {
    try {
        // Chỉ lấy các trường cần cập nhật
        const updateData = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;

        const updatedCate = await categoryModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        if (!updatedCate) {
            throw new Error('Không tìm thấy danh mục');
        }
        return updatedCate;
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi cập nhật dữ liệu');
    }
}
// Xóa danh mục
async function deleteCate(id) {
    try {
        const result = await categoryModel.findByIdAndDelete(id);
        if (!result) {
            throw new Error('Không tìm thấy danh mục để xóa');
        }
        return { message: 'Xóa danh mục thành công' };
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi xóa dữ liệu');
    }
}
