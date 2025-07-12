const productModel = require('../models/product.model'); 
const attributeModel = require('../models/attribute.model'); 
const productAttributeModel = require('../models/productAttribute.model');
module.exports = {
    createProductAttribute,
    getAllProductAttributes,
    updateProductAttribute
};
// Lấy tất cả thuộc tính sản phẩm
//http://localhost:3000/attribute/product-attributes
async function getAllProductAttributes() {
    try {
        return await productAttributeModel.find()
            .populate('productId', 'name')
            .populate('attributeId', 'name');
    } catch (error) {
        console.error("Lỗi:", error);
        throw new Error("Lỗi lấy thuộc tính sản phẩm");
    }
}
//sửa thuộc tính sản phẩm
async function updateProductAttribute(id, data) {
    try {
        // data có thể chứa các trường cần cập nhật, ví dụ:
        // { name, product, attribute, price, quantity }
        const updated = await productAttributeModel.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );
        return updated;
    } catch (error) {
        console.error("Lỗi cập nhật thuộc tính sản phẩm:", error);
        throw new Error("Lỗi cập nhật thuộc tính sản phẩm");
    }
}
// Tạo thuộc tính sản phẩm mới
async function createProductAttribute(data) {
    try {
        // Kiểm tra xem sản phẩm và thuộc tính có tồn tại không
        const product = await productModel.findById(data.productId);
        const attribute = await attributeModel.findById(data.attributeId);
        console.log("product:", product);
        console.log("attribute:", attribute);
        if (!product || !attribute) {
            throw new Error("Sản phẩm hoặc thuộc tính không tồn tại");
        }
        // Tạo thuộc tính sản phẩm mới
        const newProductAttribute = new productAttributeModel({
            name: data.name,
            product: {
                productId: data.productId,
                productName: product.name
            },
            attribute: {
                attributeId: data.attributeId,
                attributeName: attribute.name,
                value: data.value
            },
            price: data.price,
            quantity: data.quantity
        });
        // Lưu thuộc tính sản phẩm mới vào cơ sở dữ liệu
        const savedProductAttribute = await newProductAttribute.save();
        return savedProductAttribute;
    }
    catch (error) {
        console.error("Lỗi tạo thuộc tính sản phẩm:", error);
        throw new Error("Lỗi tạo thuộc tính sản phẩm");
    }
    }
