import React, {useState} from "react";
import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import "./ForgotPassword.scss";
import Button from "@components/Atoms/Button/index";

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue
  } = useForm({
    mode: "onChange",
    defaultValues:{
      email: ""
    }
  });

  const [response, setResponse] = useState({
    message: "",
    loading: false,
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    fetch(`http://127.0.0.1:3000/users/forgot-password`, {
      method: "POST",
      body: JSON.stringify({ recipient: data.email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setResponse({ message: json.message });
        } else {
          setResponse({ message: json.message });
        }
        setResponse((prevState) => ({ ...prevState, loading: false }));
      })
      .catch((err) => {
        console.log(err);
        setResponse({ message: err.message, loading: false });
      });
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Email:</label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => <input {...field} type="email" />}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={response.loading}>
          {/* Submit */}
          {response.loading ? "Loading..." : "Confirm"}
        </button>
        <div className="forgotpassword-message">{response.message}</div>
        <Link to="/login">
          <Button
            className={"btn btn-danger"}
            text={"Go Back"}
            onClick={() => navigate(-1)}
          />
        </Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
