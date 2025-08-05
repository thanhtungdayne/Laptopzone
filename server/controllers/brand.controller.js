const brandModel = require('../models/brand.model.js');
module.exports = {
    getAllBrands,
    getBrandDetails,
    addBrand,
    updateBrand,
    deleteBrand,
    getBrands,
    toggleStatus
};
// Get all brands status=true
async function getAllBrands() {
    try {
        const result = await brandModel.find({status: true});
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching brands');
    }
}
//lấy tất cả thương hiệu
async function getBrands() {
    try {
        const result = await brandModel.find();
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching brands');
    }
}
// Get brand details by ID
async function getBrandDetails(id) {
    try {
       const result = await brandModel.findById(id)
        return result
            
        }catch(error){
        console.log(error);
        throw new Error('Lỗi lấy dữ liệu')
        
    }
}
// Add a new brand  
async function addBrand(data) {
  try {
    const { name, description } = data;
    const newBrand = new brandModel({ name, description });
    const result = await newBrand.save();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error adding brand");
  }
}
// Update a brand by ID
async function updateBrand(id, data) {
    try {
        const { name, description } = data;
        const result = await brandModel.findByIdAndUpdate(id, { name, description }, { new: true });
        return result;      
    } catch (error) {
        console.log(error);
        throw new Error('Error updating brand');
    }
}
// Delete a brand by ID 
async function deleteBrand(id) {
    try {
        const result = await brandModel.findByIdAndDelete(id);
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Error deleting brand');
    }
}
//thay đổi trạng thái brand
async function toggleStatus(id) {
    try {
        const brand = await brandModel.findById(id);
        if (!brand) throw new Error("Brand not found");
        brand.status = !brand.status; // Đảo ngược trạng thái
        await brand.save();
        return brand;
    } catch (error) {
        console.log(error);
        throw new Error("Error toggling brand status");
    }
}
