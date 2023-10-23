const { validationResult } = require("express-validator");
const { failure, success } = require("../utilities/common");
const HTTP_STATUS = require("../constants/statusCodes");
const CartModel = require("../model/Cart");
const ProductModel = require("../model/Product");
const UserModel = require("../model/User");
const DiscountModel = require("../model/Discount");
const AuthModel = require("../model/Auth");
const { default: mongoose } = require("mongoose");

class CartController {
  async getCart(req, res) {
    try {
      const authId = req.params.id;

      const userAuth = await AuthModel.find({ _id: authId }).populate("user");

      if (!userAuth) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User was not found"));
      }

      const userId = userAuth[0].user._id;

      const user = await UserModel.findById({ _id: userId });
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User does not exist"));
      }
      const cart = await CartModel.findOne({ user: userId }).populate("products.product").populate("user");
      if (!cart) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Cart does not exist for user"));
      }

      console.log(cart.products);

      cart.products.forEach(async (element) => {
        console.log("discount", element.product.discount);
        if (element.product.discount) {
          const discountAmount = await DiscountModel.findById({ _id: String(element.product.discount) });
          console.log(discountAmount);
          console.log(discountAmount.endTime);
          if (new Date() > discountAmount.endTime) {
            console.log("condition met");
            console.log("total price", cart.total);
            console.log("single price", element.product.price);
            console.log("quantity", element.quantity);
            cart.total = element.product.price * element.quantity;
            await cart.save();
            console.log("total price after change", cart.total);
          }
        }
      });

      const cartObject = cart.toObject();

      delete cartObject.__v;
      delete cartObject.user.__v;

      // await cart.save()
      console.log("cart", cart);
      return res.status(HTTP_STATUS.OK).send(success(`Successfully got cart of ${cartObject.user.name}`, cartObject));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async addProductToCart(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(HTTP_STATUS.OK).send(failure("Failed to add the product", validation));
      }

      const authId = req.params.id;
      //   console.log(authId);
      const userAuth = await AuthModel.find({ _id: authId }).populate("user");

      if (!userAuth) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User was not found"));
      }

      const userId = userAuth[0].user._id;

      const { productId, amount } = req.body;
      console.log(req.body);
      const user = await UserModel.findById({ _id: userId });

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User does not exist"));
      }

      const cart = await CartModel.findOne({ user: userId });
      const product = await ProductModel.findById({ _id: new mongoose.Types.ObjectId(productId) });
      //   console.log(product, productId);
      if (!product) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Product with ID was not found"));
      }

      if (product.stock < amount) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Not enough products are in stock"));
      }
      // console.log("discount", product.discount);
      let discountedPrice;
      if (product.discount) {
        const discount = await DiscountModel.findById({ _id: String(product.discount) });
        console.log("discount found", discount);
        if (new Date() > discount.startTime && new Date() < discount.endTime) {
          discountedPrice = product.price - (discount.percentage / 100) * product.price;
          console.log("valid discount");
        }
      }

      if (!cart) {
        console.log("Creating new cart...");
        const newCart = await CartModel.create({
          user: userId,
          products: [{ product: productId, quantity: amount }],
          total: discountedPrice ? discountedPrice * amount : product.price * amount,
        });

        if (newCart) {
          return res.status(HTTP_STATUS.CREATED).send(success(`Added item to newly created cart for ${user.name}`, newCart));
        }
      }

      const productIndex = cart.products.findIndex((element) => String(element.product) === productId);
      if (productIndex !== -1) {
        if (product.stock < cart.products[productIndex].quantity + amount) {
          return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Not enough products are in stock"));
        }
        cart.products[productIndex].quantity += amount;
      } else {
        cart.products.push({ product: productId, quantity: amount });
      }
      cart.total = discountedPrice ? cart.total + discountedPrice * amount : cart.total + product.price * amount;

      await cart.save();
      return res.status(HTTP_STATUS.CREATED).send(success(`Added item to existing cart for ${user.name}`, cart));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(HTTP_STATUS.OK).send(failure("Failed to add the product", validation[0].msg));
      }

      const authId = req.params.id;

      const userAuth = await AuthModel.find({ _id: authId }).populate("user");

      if (!userAuth) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User was not found"));
      }

      const userId = userAuth[0].user._id;

      const { productId, amount } = req.body;

      const user = await UserModel.findById({ _id: userId });

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User does not exist"));
      }

      const cart = await CartModel.findOne({ user: userId });

      if (!cart.products.length) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("you dont any items in you cart", cart.products));
      }

      const productIndex = cart.products.findIndex((element) => String(element.product) === productId);

      if (productIndex !== -1) {
        if (cart.products[productIndex].quantity < amount) {
          return res
            .status(HTTP_STATUS.NOT_FOUND)
            .send(failure("you dont have that many items", cart.products[productIndex].quantity));
        } else {
          if (cart.products[productIndex].quantity === amount) {
            const deletedProduct = cart.products.splice(productIndex, 1);
            console.log(deletedProduct);
          } else {
            // removing quantity
            cart.products[productIndex].quantity -= amount;
          }

          // getting product's price
          const productPrice = await ProductModel.findById({ _id: productId });
          const price = productPrice.price;

          // fixing price
          cart.total -= price * amount;
          cart.save();

          return res.status(HTTP_STATUS.CREATED).send(success("successfully removed", { total: cart.total }));
        }
      } else {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("couldnt find any product"));
      }
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }
}

module.exports = new CartController();
