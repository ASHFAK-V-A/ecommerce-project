const mongoose=require('mongoose')

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true
    },
    delete: {
        type: Boolean,
        default: false,
      }
})




const categories=mongoose.model('categories',categorySchema);
module.exports = categories