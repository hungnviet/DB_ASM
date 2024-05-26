"use client";
import "./page.css";
import { useEffect, useState } from "react";
export default function ({ params }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch(
          `/api/user_management?user_id=${params.user_id_encode}`
        );
        if (res.ok) {
          const data = await res.json();
          console.log(data.Users);
          setUser(data.Users);
        } else {
          setError(
            "Sorry, something went wrong. Your account do not have permission to access this page."
          );
        }
      } catch (error) {
        setError(
          "Sorry, something went wrong. Your account do not have permission to access this page."
        );
      }
    }
    getUser();
  }, []);
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <div className="user_management_container">
      <h3>User Management</h3>
      {!user && !error && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {user && (
        <table>
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Address</th>
              <th>Email</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Seller ID</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(user) &&
              user.map((u) => (
                <tr key={u.Account_ID}>
                  <td>{u.Account_ID}</td>
                  <td>{u.Address}</td>
                  <td>{u.Email}</td>
                  <td>{u.LName + " " + u.FName}</td>
                  <td>{u.Phone_Number}</td>
                  <td>{u.Seller_ID ? u.Seller_ID : <p>none</p>}</td>
                  <td>{u.User_ID ? u.User_ID : <p>none</p>}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
