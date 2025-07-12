const brandModel = require('../models/brand.model.js');
module.exports = {
    getAllBrands,
    getBrandDetails,
    addBrand,
    updateBrand,
    deleteBrand,
};
// Get all brands
async function getAllBrands() {
    try {
        const result = await brandModel.find().limit(5);
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
