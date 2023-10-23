import React from 'react';
import './AllUsers.style.scss';
import useUsers from '../../hooks/useUsers';
import AdminHeader from "../../components/adminPanel/AdminHeader";
import { Link, Navigate, useLocation } from "react-router-dom";

const AllUsers = ({ }) => {
 const { users, error, setUsers, setError, isLoading } = useUsers();
 console.log("All Users", users);
 console.log("Loading", isLoading);

 const onEdit = (userId) => {
  console.log(userId);
 } 

 const onDelete = (userId) => {
  console.log(userId);
 } 

  return (
    <div className='container'>
    <AdminHeader/>
    <div className="user-cards">
      {!isLoading ? users.data.result.map(user => (
        <div className="user-card" key={user._id}>
          <div className="user-card-header">
            <h3>{user.name}</h3>
            <p>Email: {user.email ? user.email : "dummy@gmail.com"}</p>
          </div>
          <div className="user-card-details">
            <p>Phone: {user.phone}</p>
            <p>Gender: {user.gender}</p>
            <p>Balance: {user.balance}</p>
          </div>
          <div className="user-card-actions">
            <Link to={`/edituser/${user._id}`}>
              <button onClick={() => onEdit(user._id)}>Edit</button>
            </Link>
            <button onClick={() => onDelete(user._id)}>Delete</button>
          </div>
        </div>
      )):<h1>Loading</h1>}
    </div>
    </div>
  );
}

export default AllUsers;
