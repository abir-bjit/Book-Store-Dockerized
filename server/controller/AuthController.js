const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { success, failure } = require("../utilities/common");
const Auth = require("../model/Auth");
const User = require("../model/User");
const HTTP_STATUS = require("../constants/statusCodes");

//
const path = require("path");
const crypto = require("crypto");
const ejs = require("ejs");
const { promisify } = require("util");
const ejsRenderFile = promisify(ejs.renderFile);
const transporter = require("../config/mail");
const { default: mongoose } = require("mongoose");
const { log } = require("console");

class AuthController {
  async signup(req, res) {
    try {
      const validation = validationResult(req).array();
      console.log(validation);
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("Failed to add the user", validation[0].msg));
      }

      if (req.body.role === "admin") {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure(`Admin cannot be signed up`));
      }

      const emailCheck = await Auth.findOne({ email: req.body.email });
      if (emailCheck) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure(`User with email: ${req.body.email} already exists`));
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        address: {
          house: req.body.house,
          road: req.body.road,
          area: req.body.area,
          city: req.body.city,
          country: req.body.country,
        },
        balance: req.body.balance ? req.body.balance : 0,
      });

      // const newUser = await User.create(req.body)
      // creates new user and stores
      const newUser = await Auth.create({
        email: req.body.email,
        password: hashedPassword,
        // role: req.body.role,
        // lockedTill: Date.now(),
        lockedTill: null,
        user: user._id,
      });

      // payload, secret, JWT expiration
      // const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
      //     expiresIn: process.env.JWT_EXPIRES_IN
      // })

      newUser.password = undefined;
      newUser.__v = undefined;
      newUser.role = undefined;
      newUser.verified = undefined;
      newUser.wrongAttempts = undefined;
      newUser.isLocked = undefined;
      newUser.lockedTill = undefined;
      user.__v = undefined;

      if (newUser) {
        res
          .status(HTTP_STATUS.OK)
          .send(success("Account created successfully ", { user }));
      } else {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Account couldnt be created"));
      }
    } catch (err) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(`INTERNAL SERVER ERROR`);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // check if email & pass exist
      if (!email || !password) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("please provide mail and password"));
      }

      // fetching the fields
      const user = await Auth.findOne({ email })
        .select("+password")
        .populate("user");

      // checking if lock time passed
      if (user.lockedTill < new Date() && user.isLocked) {
        console.log(user.lockedTill < new Date());
        console.log("checking if lock time passed hit");
        await Auth.updateOne(
          { email: email }, // Filter for the document(s) to update
          {
            $set: { wrongAttempts: 0, isLocked: false },
          } // Set the locked value to false
        );

        // unlocking login
        user.isLocked = false;
      }

      // locked from login
      if (user.lockedTill > new Date() && user.isLocked) {
        console.log("checking if locked from login hit");
        console.log(user.lockedTill < new Date());
        console.log("locked till:", user.lockedTill);
        console.log("current time:", new Date());
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("You cannot login for next three hours"));
      }

      // object conversion
      const userObj = user.toObject();

      // when the user doesnt exist or pass dont match
      if (!user || !(await bcrypt.compare(password, user.password))) {
        if (user.wrongAttempts > 3) {
          // adding 3 hours of lock
          userObj.lockedTill.setHours(userObj.lockedTill.getHours() + 3);
          await Auth.updateOne(
            { email: email }, // Filter for the document(s) to update
            { $set: { isLocked: true, lockedTill: userObj.lockedTill } } // Set the isLocked value and lock time
          );
        } else {
          await Auth.updateOne(
            { email: email },
            { $inc: { wrongAttempts: 1 } } // Use $inc to increment the 'wrongAttempts' field by 1
            //{ new: true } // Return the updated document
          );
        }
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("wrong email or password"));
      }

      // const userDetails = await Auth.findOne({email})
      // .populate("user")

      // token
      const token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      // deleting unnecessary fields
      user.password = undefined;
      delete userObj.password;
      delete userObj.wrongAttempts;
      delete userObj.isLocked;
      delete userObj.lockedTill;
      delete userObj.createdAt;
      delete userObj.updatedAt;
      delete userObj.__v;

      res.setHeader("Authorization", token);
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Logged in successfully", { userObj, token }));
    } catch (err) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async sendForgotPasswordEmail(req, res) {
    try {
      const { recipient } = req.body;
      if (!recipient || recipient === "") {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Recipient email was not provided"));
      }

      const auth = await Auth.findOne({ email: recipient }).populate("user");

      if (!auth) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("User Not Found"));
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      auth.resetPasswordToken = resetToken;
      auth.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
      auth.resetPassword = true;

      await auth.save();

      const resetURL = path.join(
        process.env.FRONTEND_URL,
        "reset-password",
        resetToken,
        auth._id.toString()
      );

      const htmlBody = await ejsRenderFile(
        path.join(__dirname, "..", "views", "forgot-password.ejs"),
        {
          name: auth.user.name,
          resetURL: resetURL,
        }
      );

      const result = await transporter.sendMail({
        from: "bookstore@noreply.com",
        to: `${auth.user.name} ${recipient}`,
        subject: "Forgot Password?",
        html: htmlBody,
      });

      console.log("result", result);

      if (result.messageId) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully requested for resetting password"));
      }

      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure("Something went wrong!"));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal Server Error"));
    }
  }

  async validatePasswordResetRequest(req, res) {
    try {
      const { token, userId } = req.body;

      const auth = await Auth.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });
      if (!auth) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Invalid request"));
      }

      if (auth.resetPasswordExpire < Date.now()) {
        return res.status(HTTP_STATUS.GONE).send(failure("Expired Request"));
      }

      if (auth.resetPasswordToken !== token || auth.resetPassword === false) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .send(failure("Invalid token"));
      }
      return res.status(HTTP_STATUS.OK).send(success("Request is still valid"));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Something went wrong!"));
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, userId, newPassword, confirmPassword } = req.body;

      console.log("token", token);
      console.log("userId", userId);
      console.log("newPassword", newPassword);
      console.log("confirmPassword", confirmPassword);

      const auth = await Auth.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });
      if (!auth) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Invalid request"));
      }

      if (auth.resetPasswordExpire < Date.now()) {
        return res.status(HTTP_STATUS.GONE).send(failure("Expired request"));
      }

      if (auth.resetPasswordToken !== token || auth.resetPassword === false) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .send(failure("Invalid token"));
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Passwords do not match"));
      }
      console.log(auth);
      if (await bcrypt.compare(newPassword, auth.password)) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Password cannot be same as the old password"));
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10).then((hash) => {
        return hash;
      });

      const result = await Auth.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId) },
        {
          password: hashedPassword,
          resetPassword: false,
          resetPasswordExpire: null,
          resetPasswordToken: null,
        }
      );

      if (result.isModified) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully updated password"));
      }
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Something went wrong!"));
    }
    // return sendResponse(res, HTTP_STATUS.OK, "Request is still valid");
  }
}

module.exports = new AuthController();
