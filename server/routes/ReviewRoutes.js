const express = require("express");
const routes = express();
const { reviewValidator, userValidator } = require("../middleware/validation");
const ReviewController = require("../controller/ReviewController");
// const { isAuthenticated, isAdmin } = require("../middleware/auth");
const { isAuthorizedUser } = require("../middleware/authValidationJWT");
// const reviewValidator = require("../middleware/reviewValidation")

routes.get("/", ReviewController.getAllReviews);

// routes.get("/:reviewId", ReviewController.getOneReview);

routes.get("/:productId", ReviewController.getOneReviewProductwise);

routes.post("/add-review/:id", isAuthorizedUser, reviewValidator.addReview, ReviewController.addReview);

routes.delete("/delete-review/:id/:productId", isAuthorizedUser, userValidator.delete, ReviewController.deleteReview);

routes.patch("/update-review/:id", isAuthorizedUser, reviewValidator.updateReview, ReviewController.updateReview);

// routes.patch("/remove-from-cart", cartValidator.addItemToCart, CartController.removeProductFromCart)

// routes.put("/checkout/:userId", CartController.checkout)

module.exports = routes;
