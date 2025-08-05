//thực hiện thao tác CRUD với collection categories
const categoryModel = require('../models/category.model.js');

module.exports={getAllCate,getDetailCate,addCate,updateCate,deleteCate, getCate, updateStatus};

//lấy toàn bộ dữ liệu trong collection categories
// Hàm này có thể được sử dụng để lấy tất cả danh mục với trạng thái mặc định là true
async function getAllCate() {
    try{
        //find(); lấy toàn bộ dữ liệu trong collection
        const result =await categoryModel.find({ status: true })
        return result
    }catch(error){
        console.log(error);
        throw new Error('Lỗi lấy dữ liệu')
    }
    
}
// Lấy tất cả danh mục

async function getCate() {
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
//thay đổi trang thái danh mục
async function updateStatus(id) {
  const category = await categoryModel.findById(id);
  if (!category) throw new Error("Không tìm thấy danh mục");

  category.status = !category.status; // Đảo ngược trạng thái
  await category.save();

  return category;
}