import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import cartService from "../services/cart-service";

const useCart = (authId, token) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authId && token) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_BACKEND}/cart/${authId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          setCart(json);
          setLoading(false);
        })
        .catch((error) => {
          setCart(null);
          setLoading(false);
        });
    }
  }, [authId, token]);

  const addProductToCart = (authId, token, productId) => {
    fetch(`${import.meta.env.VITE_BACKEND}/cart/add-product-to-cart/${authId}`, {
      method: "POST",
      body: JSON.stringify({ amount: 1, productId: productId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setCart(json);
      })
      .catch((error) => {
        setCart(null);
      });
  };

  const removeProductToCart = (authId, token, productId) => {
    fetch(`${import.meta.env.VITE_BACKEND}/cart/add-product-to-cart/${authId}`, {
      method: "POST",
      body: JSON.stringify({ amount: 1, productId: productId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setCart(json);
      })
      .catch((error) => {
        setCart(null);
      });
  };

  const checkoutWithCart = (authId, token, cartId) => {
    // console.log(cartId);
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND}/transactions/create/${authId}`, {
      method: "POST",
      body: JSON.stringify({ cartId: cartId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (!json.success) {
          throw new Error(json.message);
        }
        setCart((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            products: [],
            total: json.data.total,
          },
        }));
        toast.success(json.message);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        toast.error(error.message);
        setLoading(false);
      });
  };

  return { cart, setCart, addProductToCart, removeProductToCart, checkoutWithCart, loading };
};

export default useCart;
