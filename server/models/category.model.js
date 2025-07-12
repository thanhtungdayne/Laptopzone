//kết nối collection categories
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const categorySchema = new Schema({
    name: {type:String, required: true},
    description:{type:String, required: false},

})

module.exports = mongoose.models.category ||
mongoose.model('category',categorySchema)