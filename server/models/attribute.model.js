const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  values: [{ type: String }] 
});

 module.exports = mongoose.models.attribute ||
 mongoose.model('attribute',attributeSchema)