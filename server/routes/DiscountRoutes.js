const express = require('express')
const routes = express()
const DiscountController = require("../controller/DiscountController")
const { discountValidator } = require("../middleware/validation")
// const { authValidator } = require("../middleware/authValidation");
const { isAuthorized } = require("../middleware/authValidationJWT");

// gets all the discount
routes.post('/', DiscountController.getAllDiscounts)

// adds discount
routes.post('/auth/add-discount', isAuthorized, discountValidator.addDiscount, DiscountController.addDiscount)

// deletes discount
routes.delete('/auth/delete-discount/:id', 
    isAuthorized, 
    discountValidator.id, 
    DiscountController.deleteDiscount)

// updates a discount
routes.patch('/auth/update-discount/:id', 
    isAuthorized,
    discountValidator.updateDiscount, 
    DiscountController.update)

module.exports = routes