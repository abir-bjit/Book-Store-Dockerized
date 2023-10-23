import React, { useEffect, useState } from "react";
import "./index.scss";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [valid, setValid] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [response, setResponse] = useState({
    message: "",
    loading: false,
  });

  const { token, userId } = useParams();

  useEffect(() => {
    fetch(
      `http://127.0.0.1:3000/users/validate-password-reset-request`,
      {
        method: "POST",
        body: JSON.stringify({ token: token, userId: userId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setValid(true);
        } else {
          setValid(false);
          setResponse((prevState) => ({
            ...prevState,
            message: "Request is no longer valid",
          }));
        }
      });
  }, [token, userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponse((prevState) => ({ ...prevState, loading: true }));
    if (password === "" || confirmPassword === "") {
      return setResponse({
        message: "One of the fields is empty",
        loading: false,
      });
    }

    if (password !== confirmPassword) {
      return setResponse({
        message: "Password fields do not match",
        loading: false,
      });
    }
    fetch(`http://127.0.0.1:3000/users/reset-password`, {
      method: "POST",
      body: JSON.stringify({
        token: token,
        userId: userId,
        newPassword: password,
        confirmPassword: confirmPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setResponse({ message: json.message });
        }
        setResponse({ message: json.message });
        setResponse((prevState) => ({ ...prevState, loading: false }));
      })
      .catch((err) => {
        console.log(err);
        setResponse({ message: err.message, loading: false });
      });
  };
  return (
    <form className="resetpassword resetpassword-container">
      {valid ? (
        <>
          <label htmlFor="" className="resetpassword_label">
            New Password:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="resetpassword_input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="" className="resetpassword_label">
            Confirm Password:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="resetpassword_input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="resetpassword_button"
            onClick={handleSubmit}
            disabled={response.loading}
          >
            {response.loading ? "Loading..." : "Confirm"}
          </button>

          <button type="button" className="btn" onClick={togglePasswordVisibility}>
            {showPassword ? "Hide Password" : "Show Password"}
          </button>
        </>
      ) : null}

      <div className="resetpassword_message">{response.message}</div>
    </form>
  );
};

export default ResetPassword;