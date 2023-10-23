import React from "react";
import useCart from "@hooks/useCart";
import { useSelector } from "react-redux";
import Layout from "@components/Templates/Layout";
import "./index.scss";

import { ToastContainer, toast } from "react-toastify";

const Cart = () => {
  // const authId = localStorage.getItem("authId");

  const authSelector = useSelector((state) => state.auth.auth);
  const { cart, checkoutWithCart, loading } = useCart(authSelector.authId, authSelector.token);
  // console.log(cart?.data.products);
  return (
    <Layout>
      <div className="cart-container">
        <h1 className="cart-header">Cart</h1>
        {cart && cart.data && cart.data.products && cart.data.products.length > 0 ? (
          cart?.data.products.map((element, i) => {
            return (
              <div
                className="cart-item"
                key={i}
                style={{ display: "grid", gridTemplateColumns: "50% 50%", width: "50%", border: "1px solid black" }}
              >
                <div>Title: {element?.product.name}</div>
                <div style={{ textAlign: "end" }}>Quantity: {element?.quantity}</div>
                <div className="price"> Price: {element?.quantity * element?.product.price} </div>
              </div>
            );
          })
        ) : (
          <div>Cart is empty</div>
        )}
        Total Cost in Cart: {cart && cart.data && cart.data.total}
      </div>
      <div className="cart-container">
        {!loading ? (
          <button
            className="checkout-button"
            onClick={() => {
              checkoutWithCart(authSelector.authId, authSelector.token, cart.data._id);
            }}
            disabled={(cart && cart.data && cart.data.products && cart.data.products.length === 0) || loading}
          >
            Checkout
          </button>
        ) : (
          <div className="loading-message">Please wait...</div>
        )}
        <ToastContainer hideProgressBar={true} />
      </div>
    </Layout>
  );
};

export default Cart;
