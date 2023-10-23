const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const { success, failure } = require("./utilities/common");

const databaseConnection = require("./config/database");
// const User = require('./model/Product')
const ProductRouter = require("./routes/ProductRoutes");
const TransactionRouter = require("./routes/TransactionRoutes");
const UserRouter = require("./routes/UserRoutes");
const AuthRouter = require("./routes/AuthRoutes");
const ReviewRouter = require("./routes/ReviewRoutes");
const DiscountRouter = require("./routes/DiscountRoutes");
const ForgotPasswordRouter = require("./routes/ForgotPasswordRoutes");

const CartRouter = require("./routes/CartRoutes");
const multer = require("multer");
const FileRouter = require("./routes/File");

const ProductController = require("./controller/ProductController");

const app = express();

dotenv.config();

// const corsOptions = {
//     origin: "http://localhost:5173",
//     credentials: true,
// };

// app.use(cors(corsOptions));

app.use(cors({ origin: "*" }));

app.use(express.json()); // Parses data as JSON
app.use(express.text()); // Parses data as text
// app.use(express.urlencoded({ extended: true })); // Parses data as urlencoded

// checks invalid json file
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ message: "invalid json file" });
  }

  // if (err instanceof multer.MulterError) {
  //   return res.status(404).send(failure(err.message));
  // }

  next();
});

const PORT = 3000;

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "/server/access.log"),
  { flags: "a" }
);

// Use morgan with a combined format and stream it to the access log file
// app.use(morgan("combined", { stream: accessLogStream }));
app.use("/products", ProductRouter);
app.use("/transactions", TransactionRouter);
app.use("/users", UserRouter);
app.use("/users", AuthRouter);
app.use("/cart", CartRouter);
app.use("/review", ReviewRouter);
app.use("/discount", DiscountRouter);
app.use("/files", FileRouter);

//
app.use((err, req, res, next) => {
  console.log("multer error:", err);
  if (err instanceof multer.MulterError) {
    return res.status(404).send(failure(err.message));
  } else {
    next(err);
  }
});
//

// app.use("/forgotpassword",  ForgotPasswordRouter)

// Route to handle all other invalid requests
app.use((req, res) => {
  return res.status(400).send({ message: "Route doesnt exist" });
});

databaseConnection(() => {
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
});
