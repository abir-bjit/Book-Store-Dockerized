const express = require("express");
const routes = express();
// const { userValidator, productValidator, cartValidator } = require("../middleware/validation");
const ProductController = require("../controller/ProductController");
// const { isAuthenticated, isAdmin } = require("../middleware/auth");
const CartController = require("../controller/CartController");
const cartValidator = require("../middleware/cartValidation");
const { isAuthorizedUser } = require("../middleware/authValidationJWT");

routes.get("/:id", isAuthorizedUser, CartController.getCart);
routes.post("/add-product-to-cart/:id", isAuthorizedUser, cartValidator.addItemToCart, CartController.addProductToCart);

routes.patch(
  "/remove-from-cart/:id",
  isAuthorizedUser,
  // cartValidator.addItemToCart,
  CartController.removeProductFromCart
);

module.exports = routes;
