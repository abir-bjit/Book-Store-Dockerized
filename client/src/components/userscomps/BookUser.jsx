import React, { useState, useEffect } from "react";
import Button from "../Atoms/Button/index";
import { CurrencyContext } from "../../context/currencies-context";
// import "../../App.scss";
import { Link, Navigate } from "react-router-dom";
import { coursesDB } from "../../database/coursesDB";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cart/cartSlice";
import BookDetail from "../BookDetail";

import { motion } from "framer-motion";
import "./BookUser.scss";

const BookUser = ({ book }) => {
  const [showDetail, isShowDetail] = useState(false);
  const currency = React.useContext(CurrencyContext);
  const { name, author, description, price } = book;

  const dispatch = useDispatch();

  const handleAddToCart = (book) => {
    console.log("clicked", book);
    dispatch(addToCart(book));
  };

  const contextPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.code,
  }).format(price * currency.conversionRate);

  //   change course bg
  const [courseBg, setCourseBg] = useState();

  useEffect(() => {
    if (currency.code === "USD") {
      setCourseBg("card-light");
    }
    if (currency.code === "EUR") {
      setCourseBg("card-primary");
    }
    if (currency.code === "GBP") {
      setCourseBg("card-danger");
    }
  }, [currency.code]);

  const handleBookDetails = () => {
    isShowDetail((show) => !show);
    console.log("showDetail", showDetail);
  };
  return (
    <>
      {/* {showDetail && (
        <BookDetail
          book={book}
          // handleBookDetails={handleBookDetails}
          // showDetail={showDetail}
          // isShowDetail={isShowDetail}
        />
      )} */}
      <li
        className={`card ${courseBg} mb-1`}
        // style={{ width: 250 }}
        onClick={() => handleBookDetails(book)}
      >
        <div className="card-header">{name}</div>
        <div className="card-sub-header">{author}</div>
        <img
          src={book.img ? book.img : coursesDB[0].img}
          // src="https://www.bishleshon.com/english/wp-content/uploads/2023/02/Hamlet-Book-Cover.jpg"
          alt="course img"
          style={{ width: "100%" }}
        />
        {/* <p className="card-body">{description}</p> */}
        <div className="card-footer d-flex">
          <h4>{contextPrice}</h4>
          {/* <Button className="btn-primary" text="BUY" /> */}
        </div>
        <div className="card-footer d-flex justify-content-between mt-1">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              className={"btn btn-danger"}
              text={"Add to Cart"}
              btnType={"button"}
              onClick={() => {
                handleAddToCart(book);
              }}
            ></Button>
            <Link to={`/editbook/${book._id}`}>
              <Button className="btn-primary" text="Details" />
            </Link>
          </div>
        </div>
      </li>
    </>
  );
};

export default BookUser;
