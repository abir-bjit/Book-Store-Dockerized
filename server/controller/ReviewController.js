const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const { failure, success } = require("../utilities/common");
const HTTP_STATUS = require("../constants/statusCodes");
const ReviewModel = require("../model/Review");
const ProductModel = require("../model/Product");
const UserModel = require("../model/User");
const AuthModel = require("../model/Auth");

class ReviewController {
  async getAllReviews(req, res) {
    let reviews;
    try {
      reviews = await ReviewModel.find({}).populate("product").populate("reviews.user");

      // console.log(transaction[0].products);
      if (reviews) {
        res.status(200).send(
          success("Successfully received all reviews", {
            result: reviews,
          })
        );
      } else {
        res.status(200).send("reviews could not be fetched");
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send(`internal server error`);
    }
  }

  async getOneReview(req, res) {
    try {
      const { reviewId } = req.params;

      const reviewPopulate = await ReviewModel.findOne({ _id: reviewId }).populate("product").populate("reviews.user");
      if (!reviewPopulate) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Review does not exist"));
      }
      return res.status(HTTP_STATUS.OK).send(success("Successfully got the review", reviewPopulate));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async getOneReviewProductwise(req, res) {
    try {
      const { productId } = req.params;

      const reviewPopulate = await ReviewModel.findOne({ product: productId }).populate("product").populate("reviews.user");

      console.log("reviewPopulate", reviewPopulate);
      if (!reviewPopulate) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Review does not exist"));
      }
      return res.status(HTTP_STATUS.OK).send(success("Successfully got the review", reviewPopulate));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async addReview(req, res) {
    try {
      const validation = validationResult(req).array();
      // console.log(validation);
      if (validation.length > 0) {
        return res.status(HTTP_STATUS.OK).send(failure("Failed to add the review", validation[0].msg));
      }

      const authId = req.params.id;

      const userAuth = await AuthModel.find({ _id: authId }).populate("user");

      if (!userAuth) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User was not found"));
      }

      const userId = userAuth[0].user._id;

      const { productId, review, rating } = req.body;

      const user = await UserModel.findById({ _id: userId });

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User does not exist"));
      }

      const productReview = await ReviewModel.findOne({ product: productId });

      if (productReview) {
        const reviewExists = productReview.reviews.filter((element) => {
          if (String(element.user) === String(userId)) {
            return true;
          }
        });
        console.log("reviewExists", reviewExists);
        // checking if review already exists
        if (reviewExists.length) {
          return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Same user cannot review twice"));
        }
      }

      const product = await ProductModel.findById({ _id: productId });

      if (!product) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Product with ID was not found"));
      }

      if (!productReview) {
        console.log("Creating new review...");
        const newReview = await ReviewModel.create({
          product: productId,
          reviews: [{ user: userId, review: review, rating: rating }],
        });

        if (newReview) {
          return res.status(HTTP_STATUS.CREATED).send(success("Added review successfully", newReview));
        }
      }

      productReview.reviews.push({ user: userId, review: review, rating: rating });

      const total = productReview.reviews.reduce((acc, curr) => {
        return acc + Number(curr.rating);
      }, 0);

      const average = total / productReview.reviews.length;

      productReview.averageRating = average;

      await productReview.save();
      productReview.__v = undefined;
      return res.status(HTTP_STATUS.CREATED).send(success("Review added successfully", productReview));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async deleteReview(req, res) {
    try {
      const validation = validationResult(req).array();
      // console.log(validation);
      if (validation.length > 0) {
        return res.status(HTTP_STATUS.OK).send(failure("Failed to delete review", validation[0].msg));
      }

      const authId = req.params.id;

      const userAuth = await AuthModel.find({ _id: authId }).populate("user");

      if (!userAuth) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User was not found"));
      }

      const userId = userAuth[0].user._id;

      const productId = req.params.productId;

      const deletedItem = await ReviewModel.findOneAndUpdate(
        { product: productId, "reviews.user": userId },
        { $pull: { reviews: { user: userId } } },
        { new: true }
      );

      console.log("deleted review", deletedItem);

      if (!deletedItem) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Review not found"));
      }

      const productReview = await ReviewModel.findOne({ product: productId });

      if (!productReview.reviews.length) {
        productReview.averageRating = 0;
        await productReview.save();
        return res.status(HTTP_STATUS.ACCEPTED).send(success("Review deleted successfully", productReview));
      }

      const total = productReview.reviews.reduce((acc, curr) => {
        return acc + Number(curr.rating);
      }, 0);

      const average = total / productReview.reviews.length;

      productReview.averageRating = average;

      await productReview.save();

      const productReviewObj = productReview.toObject();
      delete productReviewObj.__v;
      return res.status(HTTP_STATUS.ACCEPTED).send(success("Review deleted successfully", productReviewObj));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async updateReview(req, res) {
    try {
      const validation = validationResult(req).array();
      // console.log(validation);
      if (validation.length > 0) {
        return res.status(HTTP_STATUS.OK).send(failure("Failed to update review", validation[0].msg));
      }

      const authId = req.params.id;

      const userAuth = await AuthModel.find({ _id: authId }).populate("user");

      if (!userAuth) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User was not found"));
      }

      const userId = userAuth[0].user._id;

      const { productId, review, rating } = req.body;

      const updatedItem = await ReviewModel.findOneAndUpdate(
        { product: productId, "reviews.user": userId },
        { $set: { "reviews.$.review": review, "reviews.$.rating": rating } },
        { new: true }
      );

      console.log("updated item", updatedItem);

      if (!updatedItem) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Item not found" });
      }

      // updating ratings
      const productReview = await ReviewModel.findOne({ product: productId });

      const total = productReview.reviews.reduce((acc, curr) => {
        return acc + Number(curr.rating);
      }, 0);

      const average = total / productReview.reviews.length;

      productReview.averageRating = average;

      await productReview.save();

      return res.status(HTTP_STATUS.ACCEPTED).send(success("Review updated successfully", productReview));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }
}

module.exports = new ReviewController();
