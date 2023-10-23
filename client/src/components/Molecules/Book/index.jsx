import React, { useState, useEffect } from "react";
import Button from "@components/Atoms/Button";
import { CurrencyContext } from "@context/currencies-context";
// import "@App.scss";
import { Link, Navigate, useLocation } from "react-router-dom";
import { coursesDB } from "@database/coursesDB";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@store/cart/cartSlice";
import "./styles.scss";
import useCart from "@hooks/useCart";
import axios from "axios";
// import useProducts from "@hooks/useProducts";
// import useCart from "@hooks/useCart";

const Book = ({ _id, name, author, description, price, img }) => {
  const [showDetail, isShowDetail] = useState(false);
  const currency = React.useContext(CurrencyContext);
  const authSelector = useSelector((state) => state.auth.auth);
  const { addProductToCart } = useCart();
  const [isDeleted, setIsDeleted] = useState(false);
  const location = useLocation();

  const dispatch = useDispatch();

  const contextPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.code,
  }).format(price * currency.conversionRate);

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

  const handleAddToCart = (_id) => {
    console.log("clicked", _id);
    dispatch(addToCart({ _id: _id, price: price }));
    addProductToCart(authSelector.authId, authSelector.token, _id);
  };

  const handleDelete = (e) => {
    e.preventDefault();

    axios
      .delete(`http://127.0.0.1:3000/products/${_id}`, {
        headers: {
          Authorization: `Bearer ${authSelector.token}`,
        },
      })
      .then((response) => {
        console.log("Book deleted:", response.data);
        if (response.data.success) {
          setIsDeleted(true);
        }
      })
      .catch((error) => {
        console.error("Error deleting book:", error);
      });
  };

  if (isDeleted) {
    return <Navigate to="/admin/all-books" />;
  }

  return (
    <li className={`card ${courseBg} mb-1`} onClick={() => handleBookDetails()}>
      <div className="card-header">{name}</div>
      <div className="card-sub-header">{author}</div>
      <img
        src={
          img
            ? `${import.meta.env.VITE_BACKEND}/files/get/${img}`
            : coursesDB[0].img
        }
        alt="course img"
        style={{ width: "100%" }}
      />
      <div className="card-footer d-flex">
        <h4>{contextPrice}</h4>
      </div>
      <div className="card-footer d-flex justify-content-between mt-1">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {authSelector?.user.role === "user" ? (
            <Button
              className={"btn btn-danger"}
              text={"Add to Cart"}
              btnType={"button"}
              onClick={() => {
                handleAddToCart(_id);
              }}
            ></Button>
          ) : null}
          <Link to={`/bookdetails/${_id}`}>
            <Button className="btn-primary" text="Details" />
          </Link>
          {authSelector?.user.role === "admin" && location.pathname !== "/" ? (
            <Link to={`/editbook/${_id}`}>
              <Button className="btn-primary" text="EDIT" />
            </Link>
          ) : null}
          {authSelector?.user.role === "admin" && location.pathname !== "/" ? (
            <Button
              onClick={handleDelete}
              className="btn btn-danger"
              text="DELETE"
            />
          ) : null}
        </div>
      </div>
    </li>
  );
};

export default Book;
