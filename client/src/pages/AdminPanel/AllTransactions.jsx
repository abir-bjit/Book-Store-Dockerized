import React, { useState, useEffect } from 'react';
import './AllTransactions.scss'; 
import apiClient from '../../services/api-client';
import AdminHeader from '../../components/adminPanel/AdminHeader';

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/transactions?detail=1')
      .then((response) => {
        // console.log("transactions", response.data);
        if(response.data.success){
            setTransactions(response.data.data.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      });
  }, []);

//   console.log("transactions", transactions);

  transactions.forEach((transaction)=>{
    transaction.products.forEach((product)=>{
        console.log(product.product.price);
    })
  })

  return (
    <>
    <div className="transaction-container all-transactions">
    <AdminHeader/>
      <h1>All Transactions</h1>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="transaction-cards">
          {transactions.map(transaction => (
            <div className="transaction-card" key={transaction._id}>
              <div className="transaction-details">
                <h3>{transaction.user.name}</h3>
                <p>Phone: {transaction.user.phone}</p>
                <h4>Products:</h4>
                <ul>
                  {transaction.products.map(product => (
                    <li key={product._id}>
                      {product.product.name} - Quantity: {product.quantity}, Price: ${product.product.price}
                    </li>
                  ))}
                </ul>
                <p>Total Products Bought: {transaction.products.length}</p>
                <p>Total Price: ${transaction.total}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default AllTransactions;
