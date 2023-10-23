const { body, query, param } = require("express-validator");
const { isValidObjectId } = require("mongoose");

const cartValidator = {
    addItemToCart: [
        param("id")
            .exists()
            .withMessage("User ID must be provided")
            .bail()
            .matches(/^[a-f\d]{24}$/i)
            .withMessage("ID is not in valid mongoDB format"),
        body("productId")
            .exists()
            .withMessage("Product ID must be provided")
            .bail()
            .matches(/^[a-f\d]{24}$/i)
            .withMessage("ID is not in valid mongoDB format"),
        body("amount")
            .exists()
            .withMessage("Product quantity must be provided")
            .bail()
            .isInt({ min: 1 })
            .withMessage("Quantity must be one or above"),
    ],
};

module.exports = cartValidator