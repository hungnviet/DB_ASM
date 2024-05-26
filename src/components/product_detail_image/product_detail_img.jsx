"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./product_detail_img.css";
export default function Product_detail_img({ product_id }) {
  function slide_right() {
    if (img_index < img_url.length - 1) {
      set_img_index(img_index + 1);
    } else {
      set_img_index(0);
    }
  }
  function slide_left() {
    if (img_index > 0) {
      set_img_index(img_index - 1);
    } else {
      set_img_index(img_url.length - 1);
    }
  }
  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`/api/product/?product_id=${product_id}`);
      const data = await response.json();
      console.log(data);
      set_img_url(data[0].image);
    }
    fetchProduct();
  }, []);
  const [img_url, set_img_url] = useState([]);
  const [img_index, set_img_index] = useState(0);

  return (
    <div className="img_container_product_detail">
      <div className="big_img_container">
        <button className="btn_slide_img_left" onClick={slide_left}>
          <Image src="/icon_arr_left.png" width={30} height={30} />
        </button>
        <Image src={img_url[img_index]} alt="product_detail_img" fill="true" />
        <button className="btn_slide_img_right" onClick={slide_right}>
          <Image src="/icon_arr_right.png" width={30} height={30} />
        </button>
      </div>
      <div className="list_img_product_detail">
        {img_url.map((item, index) => {
          return (
            <div
              key={index}
              className={
                img_index === index
                  ? "img_product_detail_active"
                  : "img_product_detail"
              }
              onClick={() => set_img_index(index)}
            >
              <Image src={item} alt="product_detail_img" fill="true" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
