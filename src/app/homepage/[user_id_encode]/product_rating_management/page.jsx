"use client";
import "./page.css";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function ({ params }) {
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(
          `/api/product_rating_management?user_id=${params.user_id_encode}`
        );
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          if (Array.isArray(data)) {
            setProductData(data);
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
    console.log(productData);
  }, [productData]);
  return (
    <div className="product_rating_container">
      <h3>Product Rating</h3>
      {!productData && !error && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {productData && (
        <div className="list_product_rating">
          {productData.map((product) => (
            <div key={product.Product_ID} className="product_rating_item">
              <div>
                <Image
                  src={product.Image_URL}
                  alt={product.Product_Name}
                  width={100}
                  height={100}
                />
              </div>
              <div>
                <p style={{ fontWeight: "bold" }}>{product.Product_Name}</p>
                <p>Price: {product.Product_price}$</p>
                <p>Rating: {product.Average_Rating}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
