// const ProductModel = require('../model/ProductModel')
const HTTP_STATUS = require("../constants/statusCodes");
const { validationResult } = require("express-validator");
const { success, failure } = require("../utilities/common");
const ProductModel = require("../model/Product");
const DiscountModel = require("../model/Discount");
const nodemailer = require("nodemailer");
const transport = require("../config/mail");

async function notifyAdmin() {
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5d06ec2464c1ed",
      pass: "f4396162c018aa",
    },
  });

  var message = {
    from: "sender@server.com",
    to: "receiver@sender.com",
    subject: "Message title",
    text: "Plaintext version of the message",
    html: "<p>HTML version of the message</p>",
  };

  transport.sendMail(message);
}
class Product {
  async getAll(req, res) {
    try {
      const {
        sortParam,
        sortOrder,
        search,
        name,
        author,
        price,
        priceFil,
        stock,
        stockFil,
        page,
        limit,
      } = req.query;
      if (page < 1 || limit < 0) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Page and limit values must be at least 1"));
      }
      if (
        (sortOrder && !sortParam) ||
        (!sortOrder && sortParam) ||
        (sortParam &&
          sortParam !== "stock" &&
          sortParam !== "price" &&
          sortParam !== "name") ||
        (sortOrder && sortOrder !== "asc" && sortOrder !== "desc")
      ) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Invalid sort parameters provided"));
      }
      const filter = {};

      if (price && priceFil) {
        if (priceFil === "low") {
          filter.price = { $lte: parseFloat(price) };
        } else {
          filter.price = { $gte: parseFloat(price) };
        }
      }
      if (stock && stockFil) {
        if (stockFil === "low") {
          filter.stock = { $lte: parseFloat(stock) };
        } else {
          filter.stock = { $gte: parseFloat(stock) };
        }
      }

      if (name) {
        filter.name = { $regex: name, $options: "i" };
      }
      if (author) {
        filter.author = { $in: author.toLowerCase() };
      }
      if (search) {
        filter["$or"] = [
          { name: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
        ];
      }
      console.log(filter.$or);
      // console.log(typeof Object.keys(JSON.parse(JSON.stringify(filter)))[0]);
      const productCount = await ProductModel.find({}).count();
      const products = await ProductModel.find(filter)
        .sort({
          [sortParam]: sortOrder === "asc" ? 1 : -1,
        })
        .skip((page - 1) * limit)
        .limit(limit ? limit : 10);
      // console.log(products)
      if (products.length === 0) {
        return res.status(HTTP_STATUS.OK).send(
          success("No products were found", {
            total: productCount,
            totalPages: null,
            count: 0,
            page: 0,
            limit: 0,
            products: [],
          })
        );
      }

      console.log(products);

      // await notifyAdmin()

      // var message = {
      //   from: "sender@server.com",
      //   to: "receiver@sender.com",
      //   subject: "Message title",
      //   text: "Plaintext version of the message",
      //   html: "<p>HTML version of the message</p>"
      // };

      // transport.sendMail(
      //   message
      // )

      return res.status(HTTP_STATUS.OK).send(
        success("Successfully got all products", {
          total: productCount,
          totalPages: limit ? Math.ceil(productCount / limit) : null,
          count: products.length,
          page: parseInt(page),
          limit: parseInt(limit),
          products: products,
        })
      );
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  // gets only one product
  async getOne(req, res) {
    try {
      const validation = validationResult(req).array();
      // console.log(validation);
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Failed to get the product", validation[0].msg));
      }

      const { id } = req.params;

      const product = await ProductModel.find({ _id: id });

      if (product) {
        return res.status(HTTP_STATUS.OK).send(product[0]);
      } else {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(`failed to recieve product`);
      }
    } catch (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send(`internal server error`);
    }
  }

  // adds
  async add(req, res) {
    try {
      // const validation = validationResult(req).array();
      // // console.log(validation);
      // if (validation.length > 0) {
      //     return res
      //         .status(HTTP_STATUS.OK)
      //         .send(failure("Failed to add product", validation[0].msg));
      // }
      const {
        name,
        author,
        category,
        description,
        releaseDate,
        pages,
        price,
        stock,
      } = req.body;

      console.log("Req Body", req.body);
      const img = req.file.filename;
      console.log("img", img);
      const user = new ProductModel({
        name,
        author,
        category,
        description,
        releaseDate,
        pages,
        price,
        stock,
        img,
      });
      await user.save();
      return res
        .status(HTTP_STATUS.CREATED)
        .send(success("Book Added Successfully", user));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  // deletes a product
  async delete(req, res) {
    try {
      // const validation = validationResult(req).array();
      // // console.log(validation);
      // if (validation.length > 0) {
      //     return res
      //         .status(HTTP_STATUS.OK)
      //         .send(failure("Failed to delete product", validation[0].msg));
      // }
      const itemId = req.params.id;
      // Find the item by ID and delete it
      const deletedItem = await ProductModel.findByIdAndDelete(itemId);
      console.log("deleted item", deletedItem);

      if (!deletedItem) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Item not found" });
      }

      return res
        .status(HTTP_STATUS.ACCEPTED)
        .send(success("Product deleted successfully", deletedItem));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  // updates
  async update(req, res) {
    try {
      const productId = req.params.id;
      const updatedProductData = req.body;

      // const validation = validationResult(req).array();

      // if (validation.length > 0) {
      //     return res
      //         .status(HTTP_STATUS.OK)
      //         .send(failure("Failed to update data", validation[0].msg));
      // }

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        updatedProductData,
        // Returns the updated document
        { new: true }
      );

      if (!updatedProduct) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Item not found" });
      }
      console.log(updatedProduct);

      return res
        .status(HTTP_STATUS.ACCEPTED)
        .send(success("Product updated successfully", updatedProduct));
    } catch (error) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "INTERNAL SERVER ERROR" });
    }
  }
}

module.exports = new Product();
