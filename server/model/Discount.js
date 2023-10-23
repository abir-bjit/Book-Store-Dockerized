const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: false
  },
  endTime: {
    type: Date,
    required: false
  },
  percentage: {
    type: Number,
    required: true,
    min: 5,
    max: 60
  },
  title: {
    type: String,
    required: true
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;