const { success, failure } = require("../utilities/common");
const TransactionModel = require("../model/Transaction");
const ProductModel = require("../model/Product");
const UserModel = require("../model/User");
const CartModel = require("../model/Cart");
const DiscountModel = require("../model/Discount");
const AuthModel = require("../model/Auth");

const HTTP_STATUS = require("../constants/statusCodes");

class TransactionController {
  async getAll(request, response) {
    try {
      let transaction;
      const { detail } = request.query;

      if (detail && detail != 1) {
        return response.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Invalid parameter sent"));
      }

      // transaction = await TransactionModel.find({})
      // .populate("user")
      // .populate("products.product")

      if (detail === "1") {
        transaction = await TransactionModel.find({}).populate("user").populate("products.product");
        return response.status(200).send(
          success("Successfully received all transactions", {
            result: transaction,
          })
        );
      } else {
        transaction = await TransactionModel.find({});
        if (transaction) {
          return response.status(HTTP_STATUS.OK).send(
            success("Successfully received all transactions", {
              result: transaction,
            })
          );
        }
        return response.status(HTTP_STATUS.OK).send(success("No transactions were found"));
      }
    } catch (error) {
      console.log(error);
      return response.status(400).send(`internal server error`);
    }
  }

  // checkout
  async create(req, res) {
    try {
      const authId = req.params.id;

      const userAuth = await AuthModel.find({ _id: authId }).populate("user");
      console.log(userAuth);
      if (!userAuth) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User was not found"));
      }

      const userId = userAuth[0].user._id;
      const { cartId } = req.body;
      const cart = await CartModel.findOne({ _id: cartId, user: userId }).populate("products.product");

      if (!cart) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Cart was not found for this user"));
      }

      const user = await UserModel.findOne({ _id: userId });

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User was not found"));
      }
      console.log(cart);

      // checking if discount exists
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

      if (cart.total > user.balance) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Insufficient Balance"));
      }

      const productsList = cart.products.map((element) => {
        return element.product;
      });

      console.log("productsList", productsList);

      const productsInCart = await ProductModel.find({
        _id: {
          $in: productsList,
        },
      });

      console.log("productsInCart", productsInCart);

      if (productsList.length !== productsInCart.length) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("All products in cart do not exist"));
      }

      productsInCart.forEach((product) => {
        const productFound = cart.products.findIndex((cartItem) => String(cartItem.product._id) === String(product._id));
        if (product.stock < cart.products[productFound].quantity) {
          return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Unable to check out at this time, product does not exist"));
        }
        product.stock -= cart.products[productFound].quantity;
      });

      const bulk = [];
      productsInCart.map((element) => {
        bulk.push({
          updateOne: {
            filter: { _id: element },
            update: { $set: { stock: element.stock } },
          },
        });
      });
      console.log(productsInCart);
      console.log("bulk", bulk);

      const stockSave = await ProductModel.bulkWrite(bulk);
      const newTransaction = await TransactionModel.create({
        products: cart.products,
        user: userId,
        total: cart.total,
      });

      user.balance -= cart.total;
      await user.save();

      cart.products = [];
      cart.total = 0;
      const cartSave = await cart.save();

      console.log("cartSave:", cartSave);
      console.log("stockSave:", stockSave);
      console.log("newTransaction:", newTransaction);

      if (cartSave && stockSave && newTransaction) {
        return res.status(HTTP_STATUS.OK).send(success("Successfully checked out!", newTransaction));
      }

      return res.status(HTTP_STATUS.OK).send(failure("Something went wrong"));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }
}

module.exports = new TransactionController();
