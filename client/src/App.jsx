// import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Store from "./pages/Store";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import Register from "./pages/Register";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Authenticate, AuthenticateAdmin } from "./utils/authenticate";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPanel/AdminPage";
import AllUsers from "./pages/AdminPanel/AllUsers";
import AboutPage from "./pages/About";
import BookDetailsPage from "./pages/BookDetails";
import Cart from "./pages/Cart";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadAuth } from "./store/auth";
import AllTransactions from "./pages/AdminPanel/AllTransactions";
import "react-toastify/dist/ReactToastify.css";
import EditUser from "./pages/AdminPanel/EditUser";
import "./App.scss";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/index";
// Authentication middleware disabled for cart API

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/registration" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/bookdetails/:id" element={<BookDetailsPage />} />

        <Route element={<AuthenticateAdmin />}>
          <Route path="/store" element={<Store />} />
          <Route path="/addbook" element={<AddBook />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/all-books" element={<Store />} />
          <Route path="/admin/all-users" element={<AllUsers />} />
          <Route path="/admin/all-transactions" element={<AllTransactions />} />
          <Route path="/editbook/:id" element={<EditBook />} />
          <Route path="/edituser/:id" element={<EditUser />} />
        </Route>

        <Route element={<Authenticate />}>
          <Route path="/cart" element={<Cart />} />
        </Route>

        <Route path="/login/forgotpassword" element={<ForgotPassword />} />

        <Route
          path="/reset-password/:token/:userId"
          element={<ResetPassword />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
