const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name was not provided'],
        minLength: 1,
    },
    price: {
        type: Number,
        require: [true, 'price was not provided'],
        min: 10,
    },
    stock: {
        type: Number,
        require: [true, 'stock was not provided'],
        min: 5,
    },
    pages: {
        type: Number,
        require: [true, 'page was not provided'],
    },
    author: {
        type: String,
        required: [true, 'author name was not provided'],
        maxLength: 30,
    },
    category: {
        type: String,
        required: [true, 'category was not provided'],
    },
    description: {
        type: String,
        required: [true, 'description was not provided'],
    },
    releaseDate: {
        type: Date,
        // required: [true, 'date wasnt provided'],
    },
    img: {
      type: String,
    },
    discount: {
        type: mongoose.Types.ObjectId,
        ref: "Discount",
        // required: true,
    },
}, { timestamps: true })

const Product = mongoose.model("Product", productSchema)
module.exports = Product