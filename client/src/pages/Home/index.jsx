import { useEffect, useState } from "react";
import useProducts from "@hooks/useProducts";
import { currenciesDB } from "@database/currenciesDB";
import { CurrencyContext } from "@context/currencies-context";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Search from "@components/Molecules/Search";
import Book from "@components/Molecules/Book";
import "./index.scss";
import CurrencyBar from "@components/Molecules/CurrencyBar";
import Layout from "@components/Templates/Layout";

const Store = () => {
  const [currency, setCurrency] = useState(currenciesDB.Euro);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");

  const { products, setFilter, filter } = useProducts({
    page: searchParams.get("page") ?? 1,
    limit: searchParams.get("limit") ?? 10,
  });
  const auth = useSelector((state) => state.auth.auth);

  useEffect(() => {
    const delayedInput = setTimeout(() => {
      setFilter((prevState) => ({ ...prevState, searchQuery: searchInput }));
    }, 1000);

    return () => clearTimeout(delayedInput);
  }, [searchInput, setFilter]);

  const inputHandler = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <CurrencyContext.Provider value={currency}>
      <Layout>
        {auth && <h4 className="mb-1">You are logged in as {auth?.user.name}</h4>}
        <CurrencyBar setCurrency={setCurrency} />
        <header className="text-center my-4">
          <Search onChange={inputHandler} searchQuery={searchInput} />
          <div className="sort-container">
            <span>Sort by:</span>
            <select
              name=""
              id=""
              onChange={(e) => {
                setFilter((prevState) => ({
                  ...prevState,
                  sort: {
                    ...prevState.sort,
                    param: e.target.value,
                  },
                }));
              }}
            >
              <option value="title">Title</option>
              <option value="price">Price</option>
            </select>
            <div className="sort">
              <input
                type="radio"
                name="order"
                id=""
                checked={filter.sort.order === "asc"}
                onChange={() => {
                  setFilter((prevState) => ({
                    ...prevState,
                    sort: {
                      ...prevState.sort,
                      order: "asc",
                    },
                  }));
                }}
              />
              <span>Ascending</span>
            </div>
            <div className="sort">
              <input
                type="radio"
                name="order"
                id=""
                checked={filter.sort.order === "desc"}
                onChange={() => {
                  setFilter((prevState) => ({
                    ...prevState,
                    sort: {
                      ...prevState.sort,
                      order: "desc",
                    },
                  }));
                }}
              />
              <span>Descending</span>
            </div>
          </div>
          <div className="filter-container">
            <span>Filter by: Price</span>
            <div className="filter-group">
              <input
                type="radio"
                name="filter"
                id=""
                // checked={filter.price === "0" && filter.priceFil === "high"}
                checked={filter.filter.value === "0" && filter.filter.order === "high"}
                onChange={() => {
                  setFilter((prevState) => ({
                    ...prevState,
                    filter: {
                      param: "price",
                      value: "0",
                      order: "high",
                    },
                  }));
                }}
              />
              <span className="filter-price">All</span>
            </div>
            <div className="filter-group">
              <input
                type="radio"
                name="filter"
                id=""
                checked={filter.filter.value === "15" && filter.filter.order === "high"}
                onChange={() => {
                  setFilter((prevState) => ({
                    ...prevState,
                    filter: {
                      ...prevState.filter,
                      value: "15",
                      order: "high",
                    },
                  }));
                }}
              />
              <span className="filter-price">{">"} 15.00</span>
            </div>
            <div className="filter-group">
              <input
                type="radio"
                name="filter"
                id=""
                checked={filter.filter.value === "15" && filter.filter.order === "low"}
                onChange={() => {
                  setFilter((prevState) => ({
                    ...prevState,
                    filter: {
                      ...prevState.filter,
                      value: "15",
                      order: "low",
                    },
                  }));
                }}
              />
              <span className="filter-price">15.00 {"<="}</span>
            </div>
          </div>
          <div className="books-container">
            {products && products.products && products.products.length > 0 ? (
              products.products.map(({ _id, name, author, description, price, img }) => {
                return <Book key={_id} _id={_id} name={name} author={author} description={description} price={price} img={img} />;
              })
            ) : (
              <div>No books were found</div>
            )}
          </div>
        </header>

        <div className="pagination-btn-container">
          <button
            className="btn btn-primary"
            onClick={() => {
              if (Number(searchParams.get("page")) > 1) {
                setSearchParams((prevSearchParams) => {
                  const updatedSearchParams = new URLSearchParams(prevSearchParams);
                  updatedSearchParams.set("page", String(Number(searchParams.get("page")) - 1));
                  updatedSearchParams.set("limit", String(10));
                  return updatedSearchParams.toString();
                });
              }
            }}
          >
            Prev
          </button>
          {Array(products?.totalPages)
            .fill(0)
            .map((element, i) => {
              return (
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setSearchParams((prevSearchParams) => {
                      const updatedSearchParams = new URLSearchParams(prevSearchParams);
                      updatedSearchParams.set("page", String(Number(i) + 1));
                      updatedSearchParams.set("limit", String(10));
                      return updatedSearchParams.toString();
                    });
                  }}
                  key={i}
                >
                  {i + 1}
                </button>
              );
            })}
          <button
            className="btn btn-primary"
            onClick={() => {
              if (Number(searchParams.get("page")) !== products.totalPages) {
                setSearchParams((prevSearchParams) => {
                  const updatedSearchParams = new URLSearchParams(prevSearchParams);
                  updatedSearchParams.set("page", String(Number(searchParams.get("page")) + 1));
                  updatedSearchParams.set("limit", String(10));
                  return updatedSearchParams.toString();
                });
              }
            }}
          >
            Next
          </button>
        </div>
      </Layout>
    </CurrencyContext.Provider>
  );
};

export default Store;
