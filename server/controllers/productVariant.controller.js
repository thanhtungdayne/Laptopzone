const productModel = require("../models/product.model.js");
const attributeModel = require("../models/attribute.model.js");
const productVariantModel = require("../models/productVartiant.model.js");

module.exports = {
  getAllVariants,
  getVariantByProductId,
  addVariant,
  updateVariantById,
  deleteVariantById
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

