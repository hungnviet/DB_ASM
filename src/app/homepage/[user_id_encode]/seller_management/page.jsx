"use client";
import "./page.css";
import { useEffect, useState } from "react";
export default function ({ params }) {
  const user_id = params.user_id_encode;
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("2020-01-01");
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  useEffect(() => {
    async function getSeller() {
      const data = {
        user_id: user_id,
        start_date: "2020-01-01",
        end_date: new Date().toISOString().split("T")[0],
      };
      try {
        const response = await fetch("/api/seller_management", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        setSeller(result);
      } catch (error) {
        setError(
          "Sorry, something went wrong. Your account do not have permission to access this page."
        );
      }
    }
    getSeller();
  }, []);
  useEffect(() => {
    console.log(seller);
  }, [seller]);
  async function search() {
    const data = {
      user_id: user_id,
      start_date: startDate,
      end_date: endDate,
    };
    try {
      const response = await fetch("/api/seller_management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setSeller(result);
    } catch (error) {
      setError(
        "Sorry, something went wrong. Your account do not have permission to access this page."
      );
    }
  }
  return (
    <div className="seller_management_container">
      <h3>Seller Management</h3>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={search}>Search</button>
      </div>
      {!seller && !error && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {seller && (
        <table>
          <thead>
            <tr>
              <th>Seller ID</th>
              <th>Seller Name</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(seller) &&
              seller.map((u) => (
                <tr key={u.Seller_ID}>
                  <td>{u.Seller_ID}</td>
                  <td>{u.Seller_Name}</td>
                  <td>{u.Total_Revenue}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
