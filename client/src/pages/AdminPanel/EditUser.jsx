import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminHeader from "../../components/adminPanel/AdminHeader";
import userService from "../../services/user-service";
import "./EditUser.scss";
import Button from "@components/Atoms/Button";

// Modal
import { createPortal } from "react-dom";

import { Modal } from "../../components/modal/Modal";

const EditUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [isUserUpdated, setUserUpdated] = useState(false);
  const authSelector = useSelector((state) => state.auth.auth);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleButtonClick = (value) => {
    setModalOpen(false);
    setMessage(value);
  };
  //

  console.log("authSelector", authSelector.token);

  const [error, setError] = useState("");
  const params = useParams();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    balance: "",
  });

  useEffect(() => {
    const request = userService.getOneById(params.id);
    request
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
        setFormData(res.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  console.log("user", user);
  console.log("formData", formData);
  console.log("formData", formData.name);
  console.log("formData", formData.phone);
  console.log("formData", formData.balance);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault;
    const { name, phone, balance } = formData;

    console.log("name", name);
    console.log("phone", phone);
    console.log("balance", balance);
    console.log("user id", user._id);

    axios
      .patch(
        `http://127.0.0.1:3000/users/auth/update-user-by-admin/${user._id}`,
        {
          name,
          phone,
          balance,
        },
        {
          headers: {
            Authorization: `Bearer ${authSelector.token}`,
          },
        }
      )
      .then((response) => {
        console.log("User updated:", response.data);
        setUserUpdated(true);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  console.log("book added", isUserUpdated);

  if (isUserUpdated) {
    return <Navigate to="/admin/all-users" />;
  }

  return (
    <>
      <div className="container">
        <AdminHeader />
      </div>

      {/* {user && <h4 className="mb-1">You are logged in as {user}</h4>} */}
      <form
        className="d-flex flex-column form-container"
        // onSubmit={handleSubmit}
      >
        <div className="form-group m-1">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group m-1">
          <label htmlFor="author">Phone:</label>
          <input
            type="number"
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group m-1">
          <label htmlFor="balance" style={{ width: "100%" }}>
            Balance:
          </label>
          <br />
          <input
            type="number"
            style={{ width: "100%" }}
            id="balance"
            name="balance"
            value={formData.balance || ""}
            onChange={handleChange}
          />
        </div>
        <div className="edit-user-btn">
          {/* <button className="btn btn-primary" type="submit">
            Submit
          </button> */}
          <Button
            className={"btn btn-primary"}
            text={"Submit"}
            // btnType={"submit"}
            onClick={() => setModalOpen(true)}
          />
          <Link to="/admin/all-users">
            <Button
              className={"btn btn-danger"}
              text={"Cancel"}
              onClick={() => navigate(-1)}
            />
          </Link>
        </div>
      </form>

      <div>
        {/* {message}
        <button
          className="btn btn-open"
          // onClick={
          //   // () => setModalOpen(true)
          //   // handleSubmit
          // }
        >
          Open
        </button> */}
        {modalOpen &&
          createPortal(
            <Modal
              closeModal={handleButtonClick}
              onSubmit={handleSubmit}
              onCancel={handleButtonClick}
            >
              <h1>Are You Sure?</h1>
              <br />
              <p>Press Submit to Update</p>
            </Modal>,
            document.body
          )}
      </div>
    </>
  );
};

export default EditUser;
