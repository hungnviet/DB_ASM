import Image from "next/image";
import { useRouter } from "next/navigation";
import "./product_cart_seller.css";
import { useEffect, useState } from "react";
export default function Product_cart_seller({
  Product_ID,
  userIdEncode,
  sellerIdEncode,
}) {
  const router = useRouter();
  function show_details() {
    router.push(
      `/seller_mode/${userIdEncode}/${sellerIdEncode}/product_list/${product.Product_ID}`
    );
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

  return (
    <div className="product_cart_container">
      <div className="product_cart_image_container">
        {product.image && product.image.length > 0 && (
          <Image src={product.image[0]} fill="true" alt="product image" />
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
        {product.isDiscount && (
          <div className="discount_container_cart">
            <p>{product.Percentage_sale}% OFF</p>
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
      </div>
    </div>
  );
}
