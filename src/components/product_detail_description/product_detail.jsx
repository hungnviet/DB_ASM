"use client";
import "./product_detail.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Product_detail_description({ user_id, product_id }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`/api/product/?product_id=${product_id}`);
      const data = await response.json();
      console.log("day ne");
      console.log(data);
      setProduct(data[0]);
    }
    fetchProduct();
  }, []);
  useEffect(() => {
    console.log("product:", product);
  }, [product]);
  const [quantity, setQuantity] = useState(1);
  async function handleAddToCart() {
    const data = {
      User_ID: user_id,
      Product_ID: product_id,
      Quantity: quantity,
    };
    const response = await fetch("/api/cart/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("Add to cart successfully");
      alert("Add to cart successfully");
    } else {
      console.log("Add to cart failed");
    }
  }
  return product ? (
    <div className="product_detail">
      <p className="product_detail_product_name">
        {product ? product.Product_Name : "Waiting for fetching data ..."}
      </p>
      <p>Rating: {product ? product.rating : "loading.."}</p>
      <div className="product_detail_seller">
        <div className="product_detail_seller_img_contaienr">
          <Image src="/user_seller.png" alt="seller_img" fill="true" />
        </div>
        <div className="product_detail_seller_in4">
          <div>
            <Image
              src="/location_icon.png"
              height={15}
              width={15}
              alt="location icon"
            />
            <p>Ho Chi Minh city</p>
          </div>
          <p className="product_detail_seller_name">Nguyễn Tiến Hưng</p>
        </div>
      </div>
      <div className="option_container_product_detail">
        <div className="product_detail_option">
          <p>1 Product</p>
          <p>{product.Product_price}$</p>
        </div>
      </div>
      <div className="product_detail_selection_number_product">
        <p>Quantity</p>
        <div>
          <button
            onClick={() => {
              quantity > 1 && setQuantity(quantity - 1);
            }}
          >
            <Image src="/minus_icon.png" fill="true" alt="minus icon" />
          </button>
          <p>{quantity}</p>
          <button
            onClick={() => {
              setQuantity(quantity + 1);
            }}
          >
            <Image src="/add_icon.png" fill="true" alt="add icon" />
          </button>
        </div>
      </div>
      <div className="product_detail_btn">
        <button
          className="product_detail_add_to_cart"
          onClick={handleAddToCart}
        >
          Add to cart
        </button>
      </div>
      <div className="product_detail_description">
        <p className="description_title_product_detail">Description</p>
        <div>
          <p>
            {product ? product.Description : "Waiting for fetching data ..."}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div>Waiting for fetching data ...</div>
  );
}
