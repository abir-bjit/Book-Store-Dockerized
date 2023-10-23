import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../store/auth";
import Button from "../../components/Atoms/Button/index";
import axios from "axios";
import Layout from "@components/Templates/Layout";
import "./index.scss";

const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] = useState();
  const [formData, setFormData] = useState({
    email: "abir@gmail.com",
    password: "Pass@1234",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (loggedInUser && loggedInUser.success) {
      dispatch(login(loggedInUser.data));
      if (loggedInUser.data.role === "user") {
        navigate("/");
      } else {
        navigate("/admin");
      }
    }
  }, [loggedInUser, dispatch, formData, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    console.log("email", email);
    console.log("password", password);
    axios
      .post(`http://127.0.0.1:3000/users/auth/login`, {
        email,
        password,
      })
      .then((res) => {
        console.log("logged in:", res.data);
        if (res.data.success) {
          console.log("logged in:", res.data);
          setLoggedInUser(res.data);
        }
      })
      .catch((error) => {
        console.error("Error logging in", error);
      });
  };

  return (
    <Layout>
      <div className="login-form-container">
        <h2>Login</h2>
        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column form-container"
        >
          <div className="form-group m-1">
            <label htmlFor="email">Email:</label>
            <input
              maxlength="50"
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group m-1">
            <label htmlFor="password">Password:</label>
            <input
              maxlength="50"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group m-1">
            <Link to="/login/forgotpassword">Forgot Password</Link>
          </div>
          <Button
            className={"btn btn-primary"}
            btnType="submit"
            text={"Login"}
          ></Button>
        </form>
      </div>
    </Layout>
  );
};

export default LoginPage;
