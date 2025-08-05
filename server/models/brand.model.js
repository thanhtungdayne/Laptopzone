const mongoose = require('mongoose');
const Schema = mongoose.Schema

const brandSchema = new Schema({
    name: {type:String, required: true},
    description:{type:String, required: false},
    status: {type:Boolean, default:true},
    
})
 module.exports = mongoose.models.brand ||
 mongoose.model('brand',brandSchema)