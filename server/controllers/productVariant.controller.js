const productModel = require("../models/product.model.js");
const attributeModel = require("../models/attribute.model.js");
const productVariantModel = require("../models/productVartiant.model.js");
const mongoose = require("mongoose");
module.exports = {
  getAllVariants,
  getVariantByProductId,
  addVariant,
  updateVariantById,
  deleteVariantById,
  updateMultipleVariants
};

async function getAllVariants(req, res) {
  try {
    // Lấy tất cả sản phẩm từ database
    const result = await productVariantModel.find();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

async function getVariantByProductId(productId) {
  try {
    // Tìm tất cả biến thể có productId khớp
    const variants = await productVariantModel.find({ productId });
    
    if (!variants || variants.length === 0) {
      throw new Error("Không tìm thấy biến thể cho sản phẩm này");
    }

    return variants;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi khi lấy biến thể theo productId");
  }
}
// thêm biến thể sản phẩm
async function addVariant(req) {
  try {
    console.log("Body nhận được:", JSON.stringify(req.body, null, 2));
    const { productId, variants } = req.body;

    // Kiểm tra product tồn tại
    const product = await productModel.findById(productId);
    if (!product) throw new Error("Sản phẩm không tồn tại");

    const processedVariants = [];

    for (const variant of variants) {
      const processedAttributes = [];

      for (const attr of variant.attributes) {
        const attribute = await attributeModel.findById(attr.attributeId);
        if (!attribute) throw new Error(`Không tìm thấy thuộc tính ${attr.attributeId}`);

        const value = attr.value?.trim();
        if (!value) throw new Error(`Thiếu giá trị cho thuộc tính ${attribute.name || attr.attributeName}`);

        // Bảo đảm values là mảng
        if (!Array.isArray(attribute.values)) {
          attribute.values = [];
        }

        // Thêm giá trị mới nếu chưa có
        if (!attribute.values.includes(value)) {
          attribute.values.push(value);
          await attribute.save();
        }

        processedAttributes.push({
          attributeId: attr.attributeId,
          attributeName: attr.attributeName,
          value: value
        });
      }

      processedVariants.push({
        attributes: processedAttributes,
        price: variant.price,
        originalprice: variant.originalprice,
        sku: variant.sku,
        stock: variant.stock
      });
    }

    // Kiểm tra document đã có productId hay chưa
    const existing = await productVariantModel.findOne({ productId });

    if (existing) {
      existing.variants.push(...processedVariants);
      const updated = await existing.save();
      return updated;
    } else {
      const newVariant = new productVariantModel({
        productId,
        variants: processedVariants,
      });
      const result = await newVariant.save();
      return result;
    }

  } catch (error) {
    console.error("Lỗi thêm biến thể:", error.message);
    throw error;
  }
}


// Cập nhật biến thể sản phẩm theo ID
async function updateVariantById(req) {
  try {
    const { variantId } = req.params;
    const { attributes, price, originalprice, sku, stock } = req.body;

    // Tìm productVariant chứa variant cần sửa
    const productVariant = await productVariantModel.findOne({
      "variants._id": variantId
    });

    if (!productVariant) {
      return null; // Không tìm thấy
    }

    // Tìm variant cần sửa
    const variant = productVariant.variants.id(variantId);

    // Cập nhật attributes và thêm value nếu cần
    if (attributes && Array.isArray(attributes)) {
      const processedAttributes = [];

      for (const attr of attributes) {
        const attribute = await attributeModel.findById(attr.attributeId);
        if (!attribute) throw new Error(`Không tìm thấy thuộc tính ${attr.attributeId}`);

        const value = attr.value?.trim();
        if (!value) throw new Error(`Thiếu giá trị cho thuộc tính ${attribute.name || attr.attributeName}`);

        if (!Array.isArray(attribute.values)) {
          attribute.values = [];
        }

        if (!attribute.values.includes(value)) {
          attribute.values.push(value);
          await attribute.save();
        }

        processedAttributes.push({
          attributeId: attr.attributeId,
          attributeName: attr.attributeName,
          value
        });
      }

      variant.attributes = processedAttributes;
    }

    if (price !== undefined) variant.price = price;
    if (originalprice !== undefined) variant.originalprice = originalprice;
    if (sku !== undefined) variant.sku = sku;
    if (stock !== undefined) variant.stock = stock;

    await productVariant.save();
    return variant;
  } catch (error) {
    console.error("Lỗi cập nhật biến thể:", error.message);
    throw error;
  }
}

//xóa theo variantID
async function deleteVariantById(variantId) {
  try {
    const updatedDoc = await productVariantModel.findOneAndUpdate(
      { "variants._id": variantId },
      { $pull: { variants: { _id: variantId } } },
      { new: true }
    );
    if (!updatedDoc) {
      return null; // không tìm thấy variantId
    }
    return updatedDoc;
  } catch (error) {
    console.error('Lỗi deleteVariantById:', error);
    throw error;
  }
}

//update nhiều biến thể
async function updateMultipleVariants(req) {
  try {
    const { productId, variants } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error(`Invalid productId: ${productId}`);
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      throw new Error('Variants must be a non-empty array');
    }

    // Tìm productVariant theo productId
    const productVariant = await productVariantModel.findOne({ productId });
    if (!productVariant) {
      throw new Error(`No productVariant found for productId: ${productId}`);
    }

    // Kiểm tra tính duy nhất của sku trong variants
    const skuSet = new Set(variants.map((v) => v.sku));
    if (skuSet.size !== variants.length) {
      throw new Error('Duplicate SKU found in variants');
    }

    // Kiểm tra sku không trùng với các biến thể hiện có (ngoài những biến thể đang được cập nhật)
    const existingSkus = productVariant.variants
      .filter((v) => !variants.some((update) => update.variantId === v._id.toString()))
      .map((v) => v.sku);
    const newSkus = variants.map((v) => v.sku);
    const duplicateSkus = newSkus.filter((sku) => existingSkus.includes(sku));
    if (duplicateSkus.length > 0) {
      throw new Error(`SKU already exists: ${duplicateSkus.join(', ')}`);
    }

    // Cập nhật các biến thể
    for (const update of variants) {
      const { variantId, attributes, price, originalprice, sku, stock } = update;

      if (!mongoose.Types.ObjectId.isValid(variantId)) {
        throw new Error(`Invalid variantId: ${variantId}`);
      }

      const variant = productVariant.variants.id(variantId);
      if (!variant) {
        throw new Error(`Variant not found: ${variantId}`);
      }

      // Xử lý attributes
      if (attributes && Array.isArray(attributes)) {
        const processedAttributes = [];
        for (const attr of attributes) {
          if (!mongoose.Types.ObjectId.isValid(attr.attributeId)) {
            throw new Error(`Invalid attributeId: ${attr.attributeId}`);
          }

          const attribute = await attributeModel.findById(attr.attributeId);
          if (!attribute) {
            throw new Error(`Attribute not found: ${attr.attributeId}`);
          }

          const value = attr.value?.trim();
          if (!value) {
            throw new Error(`Missing value for attribute ${attribute.name || attr.attributeName}`);
          }

          if (!Array.isArray(attribute.values)) {
            attribute.values = [];
          }

          if (!attribute.values.includes(value)) {
            attribute.values.push(value);
            await attribute.save();
          }

          processedAttributes.push({
            attributeId: attr.attributeId,
            attributeName: attr.attributeName,
            value,
          });
        }
        variant.attributes = processedAttributes;
      }

      // Cập nhật các trường khác
      if (price !== undefined) variant.price = price;
      if (originalprice !== undefined) variant.originalprice = originalprice;
      if (sku !== undefined) variant.sku = sku;
      if (stock !== undefined) variant.stock = stock;
    }

    // Lưu document
    await productVariant.save();
    return productVariant.variants.filter((v) =>
      variants.some((update) => update.variantId === v._id.toString())
    );
  } catch (error) {
    console.error('Error updating multiple variants:', error.message);
    throw error;
  }
}