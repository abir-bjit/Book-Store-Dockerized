import { useState } from "react";
import "../../App.scss";
import Button from "../../components/Atoms/Button/index";
import useProducts from "../../hooks/useProducts";
import { currenciesDB } from "../../database/currenciesDB";
import { CurrencyContext } from "../../context/currencies-context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAllProducts } from "../../store/slices/product/productSlice";
import { useEffect } from "react";
import Book from "@components/Molecules/Book";
import AdminHeader from "../../components/adminPanel/AdminHeader";

const Store = () => {
  const [currency, setCurrency] = useState(currenciesDB.Euro);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [searchParams] = useSearchParams();
  const { products } = useProducts({
    page: searchParams.get("page") ?? pagination.page,
    limit: searchParams.get("limit") ?? pagination.limit,
  });

  const authSelector = useSelector((state) => state.auth.auth);
  // console.log(authSelector);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts(products));
  }, [dispatch, products]);

  const handleAddBook = () => {
    navigate("/addbook");
  };

  return (
    <CurrencyContext.Provider value={currency}>
      <div className="container p-1">
        <AdminHeader />
        {/* <h4 className="mb-1">Change Currency</h4> */}
        <h4 className="mb-1">You are logged in as {authSelector.user.name}</h4>
        {Object.values(currenciesDB).map((cur) => (
          <Button
            key={cur.label}
            text={cur.code}
            className="btn-primary btn-sm"
            onClick={() => setCurrency(cur)}
            // onClick={() => handleCurrencyChange}
          />
        ))}
        <header className="text-center my-4">
          <h1 className="title">Book Store</h1>
        </header>
        <Button className="btn-primary" text={"Add Book"} onClick={handleAddBook} />
        <button
          className="btn btn-danger"
          onClick={() => {
            if (pagination.page > 1) {
              setPagination((prevState) => ({
                ...prevState,
                page: prevState.page - 1,
              }));
            }
          }}
        >
          Prev
        </button>
        <button
          className="btn-primary"
          onClick={() => {
            if (pagination.page !== products.totalPages) {
              setPagination((prevState) => ({
                ...prevState,
                page: prevState.page + 1,
              }));
            }
          }}
        >
          Next
        </button>
        <ul
          className="d-flex mt-1"
          style={{
            flexWrap: "wrap",
            gap: 30,
          }}
        >
          {products &&
            products.products.map(({ _id, name, author, description, price, img }) => {
              return <Book key={_id} _id={_id} name={name} author={author} description={description} price={price} img={img} />;
            })}
        </ul>

        {/* <Books list={products?.products} /> */}
      </div>
    </CurrencyContext.Provider>
  );
};

export default Store;
