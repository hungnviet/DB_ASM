"use client";
import React, { useRef } from "react";
import AdvertisementCart from "@/components/advertisement_cart/advertisement_cart";
import Product_cart from "@/components/product_cart/product_cart";
import CategoryCart from "@/components/category_cart/category_cart";
import "./homepage.css";
import { useState, useEffect } from "react";
import Image from "next/image";
export default function Page({ params }) {
  const { user_id_encode } = params;
  const productBestSellerListRef = useRef();
  const productSaleListRef = useRef();
  const advetisementListRef = useRef();
  const user_id = decodeURIComponent(user_id_encode);

  const [product_id_best_seller, setProduct_id_best_seller] = useState([]);
  const [product_id_on_sale, setProduct_id_on_sale] = useState([]);
  useEffect(() => {
    async function fechProductId() {
      const data = await fetch(`/api/customer_product`);
      if (data.ok) {
        const result = await data.json();
        console.log(result);
        setProduct_id_on_sale(result.product_ID_on_sale);
        setProduct_id_best_seller(result.product_ID_best_seller);
      } else {
        alert("Error please load again");
      }
    }
    fechProductId();
  }, []);

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollTo({
        left: ref.current.scrollLeft - 400, // adjust this as needed
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollTo({
        left: ref.current.scrollLeft + 400, // adjust this as needed
        behavior: "smooth",
      });
    }
  };
  const scrollLeftAd = () => {
    if (advetisementListRef.current) {
      advetisementListRef.current.scrollTo({
        left: advetisementListRef.current.scrollLeft - 400, // adjust this as needed
        behavior: "smooth",
      });
    }
  };

  const scrollRightAd = () => {
    if (advetisementListRef.current) {
      advetisementListRef.current.scrollTo({
        left: advetisementListRef.current.scrollLeft + 400, // adjust this as needed
        behavior: "smooth",
      });
    }
  };
  // Empty array means this effect runs once on mount
  return (
    <div className="homepage_container">
      <div className="best_seller_container">
        <p className="best_seller_title" style={{ margin: "0px" }}>
          Best Seller
        </p>
        <div className="big_best_seller_container">
          <button
            onClick={() => scrollLeft(productBestSellerListRef)}
            className="scroll_btn"
          >
            <Image
              src="/icon_arr_left.png"
              alt="left_arrow"
              width={30}
              height={50}
            />
          </button>
          <div className="product_list" ref={productBestSellerListRef}>
            {product_id_best_seller.map((product_id) => (
              <Product_cart
                key={product_id}
                userID={decodeURIComponent(user_id_encode)}
                Product_ID={product_id}
              />
            ))}
          </div>
          <button
            onClick={() => {
              scrollRight(productBestSellerListRef);
            }}
            className="scroll_btn"
          >
            <Image
              src="/icon_arr_right.png"
              alt="left_arrow"
              width={30}
              height={50}
            />
          </button>
        </div>
      </div>
      <div className="best_seller_container">
        <p className="best_seller_title" style={{ margin: "0px" }}>
          On Sale
        </p>
        <div className="big_best_seller_container">
          <button
            onClick={() => {
              scrollLeft(productSaleListRef);
            }}
            className="scroll_btn"
          >
            <Image
              src="/icon_arr_left.png"
              alt="left_arrow"
              width={30}
              height={50}
            />
          </button>
          <div className="product_list" ref={productSaleListRef}>
            {product_id_on_sale.map((product_id) => (
              <Product_cart
                key={product_id}
                userID={decodeURIComponent(user_id_encode)}
                Product_ID={product_id}
              />
            ))}
          </div>
          <button
            onClick={() => {
              scrollRight(productSaleListRef);
            }}
            className="scroll_btn"
          >
            <Image
              src="/icon_arr_right.png"
              alt="left_arrow"
              width={30}
              height={50}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
