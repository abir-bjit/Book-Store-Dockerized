import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import productService from "../../services/product-service";
import { useSelector } from "react-redux";
import { getOneProduct } from "../../store/slices/product/productSlice";
import { useDispatch } from "react-redux";
import AdminHeader from "../../components/adminPanel/AdminHeader"

const EditBook = () => {
  const [products, setProducts] = useState();
  const [isBookUpdated, setIsBookUpdated] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [error, setError] = useState("");
  const params = useParams();

  const [formData, setFormData] = useState({
    firstname: "",
    author: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    const request = productService.getOneById(params.id);
    request
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
        setFormData(res.data);
        dispatch(getOneProduct(res.data));
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, author, description, price } = formData;

    axios
      .patch(`http://127.0.0.1:3000/products/${products._id}`, {
        name,
        author,
        description,
        price,
      })
      .then((response) => {
        console.log("User updated:", response.data);
        setIsBookUpdated(true);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  console.log("book added", isBookUpdated);

  if (isBookUpdated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="container">
        <AdminHeader/>
      </div>
      
      {user && <h4 className="mb-1">You are logged in as {user}</h4>} 
      <form
        className="d-flex flex-column form-container"
        onSubmit={handleSubmit}
      >
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
      {/* <BookForm /> */}
    </>
  );
};

export default EditBook;
