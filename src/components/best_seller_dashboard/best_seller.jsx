"use client";
import { useEffect, useState } from "react";
import "./best_seller.css";
import Image from "next/image";
export default function BestSeller({ productId }) {
  const [productData, setProductData] = useState({});
  useEffect(() => {
    async function fetchData() {
      console.log("hello");
      const response = await fetch(`/api/product?product_id=${productId}`);
      const data = await response.json();
      console.log(data);
      setProductData(data[0]);
    }
    fetchData();
  }, []);
  return (
    <div className="best_seller_tag">
      <div className="best_seller_tag_img">
        <Image
          src={productData.image ? productData.image[0] : "/next.svg"}
          fill="true"
          alt="img product"
        />
      </div>
      <div className="best_seller_tag_in4">
        <p>{productData.Product_Name}</p>
        <p>{productData.Product_price} $</p>
      </div>
      <div className="best_seller_tag_sale_in4">
        <p>{(productData.Product_price * 20).toFixed(2)}</p>
        <p>20 product</p>
      </div>
    </div>
  );
}
