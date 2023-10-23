import React from "react";
import "./AdminHeader.style.scss";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  return (
    <div className="admin-options">
      <Link to="/admin/all-books">All Books</Link>
      <Link to="/admin/all-users">All Users</Link>
      <Link to="/admin/all-transactions">All Transactions</Link>
      <Link
        to="/"
        onClick={(e) => {
          localStorage.removeItem("auth");
          localStorage.removeItem("user");
          window.location.reload()
        }}
      >
        Log Out
      </Link>
      {/* <button
        onClick={(e) => {
          localStorage.removeItem("auth");
        }}
      >
        Log Out
      </button> */}
    </div>
  );
};

export default AdminHeader;
