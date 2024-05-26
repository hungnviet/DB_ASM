"use client";
import "./page.css";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function ({ params }) {
  const [cartData, setCartData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(
          `/api/view_cart_customer?user_id=${params.user_id_encode}`
        );
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          if (Array.isArray(data)) {
            setCartData(data);
          } else {
            setError(
              "Sorry, something went wrong. Your account do not have permission for seeing this page"
            );
          }
        } else {
          setError("Sorry, something went wrong. Please load again");
        }
      } catch (error) {
        setError("Sorry, something went wrong. Please load again");
      }
    }
    getData();
  }, []);
  useEffect(() => {
    console.log(cartData);
  }, [cartData]);
  return (
    <div className="cart_customer_container">
      <h3>Customer Cart</h3>
      {!cartData && !error && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {cartData && (
        <div className="table_customer_cart">
          <p>Total : {cartData.length} users</p>
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Cart ID</th>
                <th>Quantity</th>
                <th>Total price in cart</th>
              </tr>
            </thead>
            <tbody>
              {cartData.map((cart) => (
                <tr key={cart.Cart_ID}>
                  <td>{cart.Full_Name}</td>
                  <td>{cart.Email}</td>
                  <td>{cart.Address}</td>
                  <td>{cart.Cart_ID}</td>
                  <td>{cart.Quantity}</td>
                  <td>{cart.Total_Price_need_to_pay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
