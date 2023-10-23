import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productService from "../services/product-service";

const BookForm = ({ handleUpdate }) => {
  const [products, setProducts] = useState();

  const [error, setError] = useState("");

  const params = useParams();

  useEffect(() => {
    const request = productService.getOneById(params.id);
    request
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
        setFormData(res.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  console.log("Book", products);

  const [formData, setFormData] = useState({
    firstname: "",
    author: "",
    description: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (handleUpdate) {
        console.log("formData", formData);
        handleUpdate(e, formData);
      } else {
        const response = await fetch("http://127.0.0.1:3000/products/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Book added successfully!");
          setFormData({
            firstname: "",
            author: "",
            description: "",
            price: "",
          });
        } else {
          alert("Error adding book");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="d-flex flex-column container" onSubmit={handleSubmit}>
      <div className="form-group m-1">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group m-1">
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group m-1">
        <label htmlFor="description" style={{ width: "100%" }}>
          Description:
        </label>
        <br />
        <textarea
          style={{ width: "100%" }}
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group m-1">
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price || ""}
          onChange={handleChange}
          required
        />
      </div>
      <button className="btn btn-primary" type="submit">
        Submit
      </button>
    </form>
  );
};

export default BookForm;
