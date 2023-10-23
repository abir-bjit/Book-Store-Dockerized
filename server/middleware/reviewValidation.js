const { body, query, param } = require("express-validator");
const { isValidObjectId } = require("mongoose");

const reviewValidator = {
    addReview: [
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
        body("review")
            .exists()
            .withMessage("Review must be provided")
            .bail()
            .isString()
            .withMessage("Review has to be a string"),
        body('rating')
            .isFloat({ min: 0, max: 5 })
            .withMessage('Rating must be a number between 0 and 5')
    ],
};

module.exports = reviewValidator