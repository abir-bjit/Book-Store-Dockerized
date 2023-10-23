import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Outlet } from "react-router-dom";
import Layout from "@components/Templates/Layout";
import axios from "axios";

const Register = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      city: "",
      balance: 0,
    },
  });

  let firstName;
  let lastName;

  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState();
  const [message, setMessage] = useState();
  const [duplicateUser, setDuplicateUser] = useState();

  const balanceInputRef = useRef();

  const handleInputChange = () => {
    const inputValue = balanceInputRef.current.value;
    if (inputValue.length >= 50) {
      balanceInputRef.current.value = inputValue.slice(0, 50);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const firstname = watch("firstname");
  const lastname = watch("lastname");
  const name = `${getValues("firstname")} ${getValues("lastname")}`;
  const email = getValues("email");
  const password = getValues("password");
  const passwordConfirm = getValues("confirmPassword");
  const phone = getValues("phone");
  const gender = getValues("gender");
  const area = getValues("address");
  const city = getValues("city");
  const balance = getValues("balance");

  const username = `${firstname ? firstname.toLowerCase() : ""}.${lastname ? lastname.toLowerCase() : ""}`;

  useEffect(() => {
    console.log("Errors: ", errors);
  }, [errors]);

  const onSubmit = (data) => {
    console.log(data); // Replace with your submission logic
    console.log("Form is submitted ");
    // console.log("The username ", getValues("username"));
    console.log("The firstname ", getValues("firstname"));
    console.log("The lastname ", getValues("lastname"));
    console.log("The fullname ", getValues("firstname"), getValues("lastname"));
    console.log("The email ", getValues("email"));
    console.log("The phone ", getValues("phone"));
    console.log("The address", getValues("address"));
    console.log("The city", getValues("city"));
    console.log("The password", getValues("password"));
    console.log("The gender", getValues("gender"));
    console.log("The balance", getValues("balance"));

    axios
      .post(`http://127.0.0.1:3000/users/auth/signup`, {
        name,
        email,
        phone,
        gender,
        address: {
          area,
          city,
        },
        balance,
        password,
        passwordConfirm,
      })
      .then((response) => {
        console.log("Adding User:", response.data);
        if (response.data.success) {
          console.log("User Added Successfully:", response.data.data);
          setNewUser(response.data.data.user);
          setMessage(response.data.message);
          //   alert("book added successfully");
        }
      })
      .catch((error) => {
        console.error("Error Adding User:", error);
        setDuplicateUser(error.response.data);
      });

    firstName = getValues("firstname");
    lastName = getValues("lastname");

    setCurrentCity({
      firstname: firstName,
      lastname: lastName,
    });

    setValue("fullname", `${firstName} ${lastName}`);
  };

  console.log("Added user", newUser);
  console.log("Added message", message);
  console.log("Duplicate User", duplicateUser);

  const [currentCity, setCurrentCity] = useState({
    firstname: "",
    lastname: "",
  });

  return (
    <Layout>
      <form className="d-flex flex-column form-container" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group m-1">
          <label>First Name</label>
          <Controller
            name="firstname"
            control={control}
            rules={{
              required: "First name is required",
              maxLength: {
                value: 50,
                message: "First Name cannot have more than 50 characters.",
              },
            }}
            render={({ field }) => (
              <input
                maxLength={51}
                placeholder="Enter First Name"
                {...field}
                style={{ border: errors.firstname ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.firstname && <span color="red">{errors.firstname.message}</span>}
        </div>
        <div className="form-group m-1">
          <label>Last Name</label>
          <Controller
            name="lastname"
            control={control}
            rules={{
              required: "Last name is required",
              maxLength: {
                value: 50,
                message: "Last Name cannot have more than 50 characters.",
              },
            }}
            render={({ field }) => (
              <input
                maxLength={51}
                placeholder="Enter Last Name"
                {...field}
                style={{ border: errors.lastname ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.lastname && <span color="red">{errors.lastname.message}</span>}
        </div>
        <div className="form-group m-1">
          <label>Full Name</label>
          <Controller
            name="fullname"
            control={control}
            render={({ field }) => (
              <input placeholder="Full Name" {...field} style={{ border: errors.fullname ? "1px solid red" : "" }} readOnly />
            )}
          />
        </div>
        {/* <div className="form-group m-1">
          <label>Username</label>
          <Controller
            name="username"
            control={control}
            // rules={{ required: 'Username is required' }}
            render={() => (
              <input
                readOnly
                value={username}
                style={{ border: errors.username ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.username && (
            <span color="red">{errors.username.message}</span>
          )}
        </div> */}

        <div className="form-group m-1">
          <label>Email</label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              maxLength: {
                value: 50,
                message: "Email cannot have more than 50 characters.",
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <input
                maxLength={51}
                placeholder="Enter E-mail Address"
                {...field}
                style={{ border: errors.email ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.email && <span color="red">{errors.email.message}</span>}
        </div>

        <div className="form-group m-1">
          <label>Password</label>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              maxLength: {
                value: 70,
                message: "Password cannot have more than 70 characters.",
              },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "Password should have one capital, one small and a special character",
              },
            }}
            render={({ field }) => (
              <input
                maxLength={71}
                placeholder="Enter Password"
                type={showPassword ? "text" : "password"}
                {...field}
                style={{ border: errors.email ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.password && <span color="red">{errors.password.message}</span>}
        </div>
        <div className="form-group m-1">
          {/* toggle pass */}
          <button type="button" className="btn" onClick={togglePasswordVisibility}>
            {showPassword ? "Hide Password" : "Show Password"}
          </button>
        </div>

        <div className="form-group m-1">
          <label>Confirm Password</label>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Confirm Password is required",
              maxLength: {
                value: 70,
                message: "Password cannot have more than 70 characters.",
              },
              minLength: {
                value: 8,
                message: "Confirm Password must be at least 8 characters long",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "Password should have one capital, one small and a special character",
              },
              validate: (value) => value === watch("password") || "Confirm Password should match given password",
            }}
            render={({ field }) => (
              <input
                maxLength={71}
                placeholder="Enter Confirm Password"
                type={showPassword ? "text" : "password"}
                {...field}
                style={{ border: errors.email ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.confirmPassword && <span color="red">{errors.confirmPassword.message}</span>}
        </div>

        <div className="form-group m-1">
          <label>Gender:</label>
          <Controller
            name="gender"
            control={control}
            rules={{
              required: "Gender is required",
            }}
            defaultValue=""
            render={({ field }) => (
              <select {...field} style={{ border: errors.gender ? "1px solid red" : "" }}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            )}
          />
          {errors.gender && <span color="red">{errors.gender.message}</span>}
        </div>

        <div className="form-group m-1">
          <label>Phone</label>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Phone number is required",
              maxLength: {
                value: 11,
                message: "Invalid phone number",
              },
              pattern: {
                value: /^[0-9]{11}$/,
                message: "Invalid phone number",
              },
            }}
            render={({ field }) => (
              <input
                type="number"
                onInput={(e) => (e.target.value = e.target.value.slice(0, 12))}
                maxLength={11}
                placeholder="Enter Phone Number"
                {...field}
                style={{ border: errors.phone ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.phone && <span color="red">{errors.phone.message}</span>}
        </div>
        <div className="form-group m-1">
          <label>Address</label>
          <Controller
            name="address"
            control={control}
            rules={{
              required: "Address is required",
              maxLength: {
                value: 50,
                message: "Address cannot have more than 50 characters.",
              },
            }}
            render={({ field }) => (
              <input
                maxLength={51}
                placeholder="Enter Address"
                {...field}
                style={{ border: errors.address ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.address && <span color="red">{errors.address.message}</span>}
        </div>
        <div className="form-group m-1">
          <label>City</label>
          <Controller
            name="city"
            control={control}
            rules={{
              required: "City is required",
              maxLength: {
                value: 50,
                message: "City cannot have more than 50 characters.",
              },
            }}
            render={({ field }) => (
              <input
                maxLength={51}
                placeholder="Enter City"
                {...field}
                style={{ border: errors.address ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.city && <span color="red">{errors.city.message}</span>}
        </div>

        <div className="form-group">
          <label>Balance:</label>
          <Controller
            name="balance"
            control={control}
            rules={{
              required: false,
              min: {
                value: 0,
                message: "Balance cannot be less than 0.",
              },
              max: {
                value: 1500,
                message: "Balance cannot be greater than 1500.",
              },
              pattern: {
                value: /^[0-9]+$/,
                message: "Please enter a valid number.",
              },
            }}
            render={({ field }) => (
              <input
                onInput={(e) => (e.target.value = e.target.value.slice(0, 5))}
                maxLength={5}
                placeholder="Enter Balance"
                type="number"
                {...field}
              />
            )}
          />
          {errors.balance && <span color="red">{errors.balance.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
      <Outlet context={[{ currentCity }, setCurrentCity]} />
    </Layout>
  );
};

export default Register;
