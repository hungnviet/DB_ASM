"use client";
import "../../checkout/checkout.css";
import "./page.css";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function CheckoutPage({ params }) {
  const user_id_encode = params.user_id_encode;
  const user_id = decodeURIComponent(user_id_encode);
  const order_id = params.order_id;
  const [order, setOrder] = useState(null);
  useEffect(() => {
    async function fetching() {
      const response = await fetch(`/api/order?order_id=${order_id}`);
      const data = await response.json();
      console.log(data);
      setOrder(data);
    }
    fetching();
  }, []);
  useEffect(() => {
    console.log(order);
  }, [order]);
  /// use userID to get the data that user have checkout
  const user_information = {
    user_name: "Nguyen Viet Hung",
    user_phone: "0798944343",
    user_address: [
      "13/19 , Khu Phố 6, Phường Tam Hiệp, Phường Tam Hiệp, Thành Phố Biên Hòa, Đồng Nai",
      "79/38A tổ 21 khu phố 1 phường Tân Hiệp Biên Hoà Dồng Nai Việt Nam",
    ],
  };
  return (
    <div className="checkout_page_container">
      <div className="address_checkout_page">
        <div className="header_address_checkout">
          <Image
            src="/location_checkout.png"
            alt="location icon"
            width={20}
            height={20}
          />
          <p>Dia chi nhan hang</p>
        </div>
        <div className="information_address_checkout">
          <p>{order ? order.Order.Address : "loading"}</p>
          <p>Nguyễn Viết Hùng 0798944343</p>
        </div>
      </div>
      <div className="field_bar_checkout">
        <div>
          <p>San Pham</p>
        </div>
        <div>
          <p>Giá Gốc</p>
          <p>Số Lượng</p>
          <p>Giảm Giá</p>
          <p>Thành Tiền</p>
        </div>
      </div>
      {order &&
        order.Order_Items.map((product) => {
          return (
            <div className="product_checkout_sub">
              <div className="product_checkout_left_section">
                <Image
                  src={product.ProductImage.Image_URL}
                  alt="product_img"
                  width={100}
                  height={100}
                />
                <div className="product_information_checkout">
                  <p>{product.Product.Product_Name}</p>
                </div>
              </div>
              <div className="product_checkout_right_section">
                <div>
                  <p>{product.Product.Product_price}$</p>
                </div>
                <div>
                  <p>{product.Quantity}</p>
                </div>
                <div>
                  <p>{product.Product.Discount}%</p>
                </div>
                <div>
                  <p>{product.Full_Discounted_Price} $</p>
                </div>
              </div>
            </div>
          );
        })}

      <div className="checkout_final_step">
        <div>
          <p>Tong tien hang: </p>{" "}
          <p>{order ? order.Order.total_price : "loading"} $</p>
        </div>
      </div>
    </div>
  );
}
