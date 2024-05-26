import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./product_cart.css";
export default function Product_cart({ Product_ID, userID }) {
  const router = useRouter();
  function show_details() {
    router.push(`/homepage/${encodeURIComponent(userID)}/${Product_ID}`);
  }

  async function add_to_cart() {
    console.log(`user_id: ${userID}, product_id: ${Product_ID}`);
    const data = {
      User_ID: userID,
      Product_ID: Product_ID,
      Quantity: 1,
    };
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      alert("added to cart");
      console.log(response);
    } else {
      alert("fail adding to cart");
      console.log(response);
    }
  }

  const [product, setProduct] = useState({});
  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`/api/product/?product_id=${Product_ID}`);
      const data = await response.json();
      console.log(data);
      setProduct(data[0]);
    }
    fetchProduct();
  }, []);
  const url = "/image/PRO0000006_01.png";
  return (
    <div className="product_cart_container">
      <div className="product_cart_image_container">
        {product.image && (
          <Image
            src={product.image.length > 0 ? product.image[0] : "/next.svg"}
            fill="true"
            alt="product image"
          />
        )}
      </div>
      <div className="product_cart_info_container">
        <div className="seller_in4_product_cart">
          <div className="seller_img_product_cart">
            <Image src="/user_seller.png" fill="true" alt="Seller Image" />
          </div>
          <p>{product.Seller_ID}</p>
        </div>
        <div className="product_in4_in_cart">
          <p className="product_name_cart">{product.Product_Name}</p>
          <div className="location_product_cart">
            <Image
              src={"/location_icon.png"}
              height={15}
              width={15}
              alt="Location Icon"
            />
            <p>Ho Chi Minh city</p>
          </div>
          <div className="price_container_cart">
            <div>
              <p>1 product</p>
            </div>
            <div>
              <p>{product.Product_price}</p>
            </div>
          </div>
        </div>
        {product.Discount > 0 && (
          <div className="discount_container_cart">
            <p>{product.Discount}% OFF</p>
          </div>
        )}
      </div>

      <button className="like_btn_cart_product">
        <Image src={"/heart_icon.png"} height={20} width={20} alt="Like Icon" />
      </button>
      <div className="overlay_cart_product">
        <button className="detail-button_cart_product" onClick={show_details}>
          View Detail
        </button>
        <button className="detail-button_cart_product" onClick={add_to_cart}>
          Add To Cart
        </button>
      </div>
    </div>
  );
}
