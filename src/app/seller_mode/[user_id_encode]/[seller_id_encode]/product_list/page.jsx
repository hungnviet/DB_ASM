"use client";

import { useEffect, useState } from "react";
import Product_cart_seller from "@/components/product_cart_seller/product_cart_seller";
import "./product_list.css";
export default function ({ params }) {
  const { user_id_encode, seller_id_encode } = params;
  const [product_id, setProduct_id] = useState([]);
  useEffect(() => {
    async function fechProductId() {
      const data = await fetch(
        `/api/seller_product/?Seller_ID='${seller_id_encode}'`
      );
      if (data.ok) {
        const result = await data.json();
        console.log(result);
        setProduct_id(result);
      } else {
        alert("Error please load again");
      }
    }
    fechProductId();
  }, []);
  return (
    <div className="product_list_seller_big_container">
      <div className="product_list_container">
        <div className="product_list_header_seller">
          <h2>Shop's product</h2>
          <h4>Your shop currently have : {product_id.length} </h4>
        </div>
        <div className="product_list_tag_container">
          {product_id.map((product_id) => (
            <Product_cart_seller
              key={product_id}
              userIdEncode={user_id_encode}
              sellerIdEncode={seller_id_encode}
              Product_ID={product_id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
