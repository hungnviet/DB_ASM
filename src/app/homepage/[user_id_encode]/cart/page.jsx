"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./cart.css";
export default function Page({ params }) {
  const route = useRouter();
  const { user_id_encode } = params;
  const user_id = decodeURIComponent(user_id_encode);
  const [cart, setCart] = useState(null);
  const [checkdedAllProduct, setCheckdedAllProduct] = useState(false);
  const [waiting_for_check, setWaiting_for_check] = useState(false);
  const [name_product_want_to_delete, setName_product_want_to_delete] =
    useState("");
  const [product_id_want_to_delete, setProduct_id_want_to_delete] =
    useState("");
  const [shop_index_delete, setShop_index_delete] = useState(-1);
  const [product_index_delete, setProduct_index_delete] = useState(-1);
  const [totalCartPrice, setTotalCartPrice] = useState(null);
  function check_product_item(shopIndex, productIndex) {
    let new_cart = { ...cart };
    new_cart.shop[shopIndex].product[productIndex].check =
      !new_cart.shop[shopIndex].product[productIndex].check;
    // Check if all products in the shop are checked
    const allProductsChecked = new_cart.shop[shopIndex].product.every(
      (product) => product.check
    );

    // Set the check property of the shop
    new_cart.shop[shopIndex].check = allProductsChecked;
    setCart(new_cart);
  }

  function check_shop_item(shopIndex) {
    let new_cart = { ...cart };
    new_cart.shop[shopIndex].check = !new_cart.shop[shopIndex].check;
    new_cart.shop[shopIndex].product.map((product) => {
      product.check = new_cart.shop[shopIndex].check;
    });
    setCart(new_cart);
  }

  async function add_quantity(shopIndex, productIndex) {
    // make request to server to update quantity
    let new_cart = { ...cart };
    new_cart.shop[shopIndex].product[productIndex].Quantity++;
    const data = {
      User_ID: user_id,
      Product_ID: new_cart.shop[shopIndex].product[productIndex].Product_ID,
      Quantity: new_cart.shop[shopIndex].product[productIndex].Quantity,
    };
    console.log("data: ", data);
    const response = await fetch("/api/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const result = await response.json();
      console.log("result: ", result);
      alert("Update quantity success");
    } else {
      alert("Update quantity failed");
    }
    setCart(new_cart);
  }

  async function sub_quantity(shopIndex, productIndex) {
    // make request to server to update quantity
    let new_cart = { ...cart };
    if (new_cart.shop[shopIndex].product[productIndex].Quantity > 1) {
      new_cart.shop[shopIndex].product[productIndex].Quantity--;
    }
    const data = {
      User_ID: user_id,
      Product_ID: new_cart.shop[shopIndex].product[productIndex].Product_ID,
      Quantity: new_cart.shop[shopIndex].product[productIndex].Quantity,
    };
    console.log("data: ", data);
    const response = await fetch("/api/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const result = await response.json();
      console.log("result: ", result);
      alert("Update quantity success");
    } else {
      alert("Update quantity failed");
    }
    setCart(new_cart);
  }

  function delete_product(shopIndex, productIndex) {
    // let new_cart = { ...cart };
    setWaiting_for_check(true);
    setName_product_want_to_delete(
      cart.shop[shopIndex].product[productIndex].Product_Name
    );
    setProduct_id_want_to_delete(
      cart.shop[shopIndex].product[productIndex].Product_ID
    );
    setShop_index_delete(shopIndex);
    setProduct_index_delete(productIndex);
    const data = {
      User_ID: user_id,
      Product_ID_list: [cart.shop[shopIndex].product[productIndex].Product_ID],
    };
    try {
      fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      alert("Delete success");
    } catch (err) {
      alert("Delete failed");
    }
  }

  function handle_cancel() {
    setName_product_want_to_delete("");
    setWaiting_for_check(false);
    setProduct_id_want_to_delete("");
    setShop_index_delete(-1);
    setProduct_index_delete(-1);
  }

  async function handle_delete() {
    setName_product_want_to_delete("");
    setWaiting_for_check(false);
    // make api request to delete product
    const data = {
      User_ID: user_id,
      Product_ID: product_id_want_to_delete,
    };
    console.log("data: ", data);
    const response = await fetch("/api/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const result = await response.json();
      console.log("result: ", result);
      alert("Delete success");
    } else {
      alert("Delete failed");
    }
    /// delete in UI
    let new_cart = { ...cart };
    new_cart.shop[shop_index_delete].product.splice(product_index_delete, 1);
    if (new_cart.shop[shop_index_delete].product.length === 0) {
      new_cart.shop.splice(shop_index_delete, 1);
    }
    setCart(new_cart);
  }

  function calculateCheckedProducts() {
    let total = 0;
    if (cart && Array.isArray(cart.shop)) {
      cart.shop.forEach((shop) => {
        shop.product.forEach((product) => {
          if (product.check) {
            total += product.Quantity;
          }
        });
      });
    }
    return total;
  }

  function calculateTotalPrice() {
    let total = 0;
    if (cart && Array.isArray(cart.shop)) {
      cart.shop.forEach((shop) => {
        shop.product.forEach((product) => {
          if (product.check) {
            total += product.Product_price * product.Quantity;
          }
        });
      });
    }
    return total;
  }

  function checkAllProducts() {
    let new_cart = { ...cart };
    if (checkdedAllProduct) {
      new_cart.shop.forEach((shop) => {
        shop.check = false;
        shop.product.forEach((product) => {
          product.check = false;
        });
      });
      setCheckdedAllProduct(false);
      setCart(new_cart);
    } else {
      new_cart.shop.forEach((shop) => {
        shop.check = true;
        shop.product.forEach((product) => {
          product.check = true;
        });
      });
      setCheckdedAllProduct(true);
      setCart(new_cart);
    }
  }

  async function handle_checkout() {
    if (calculateCheckedProducts() === 0) {
      alert("Please choose at least 1 product to checkout");
      return;
    }
    let new_cart = { ...cart };
    let new_cart_checkout = [];
    new_cart.shop.forEach((shop) => {
      shop.product.forEach((product) => {
        if (product.check) {
          new_cart_checkout.push({
            product_id: product.Product_ID,
            quantity: product.Quantity,
            discount: product.Percentage_sale,
          });
        }
      });
    });

    const response1 = await fetch(`/api/navbar_information?user_id=${user_id}`);
    if (response1.ok) {
      const res = await response1.json();
      const user_data = res[0];
      const { FName, LName, Address, Cart_ID } = user_data;
      const data = {
        User_ID: user_id,
        Seller_ID: new_cart.shop[0].Seller_ID,
        Product_List: new_cart_checkout,
        User_Name: `${FName} ${LName}`,
        Address: Address,
        Cart_ID: Cart_ID,
      };
      console.log("data: ", data);
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("result: ", result);
        alert("Checkout success");
      } else {
        alert("Checkout failed");
      }
    } else {
      alert("Checkout failed");
    }

    /// make api request to checkout push data to server and redirect to checkout page we clone the data of checked product to new_cart_checkout. The data will exist in the server 15 minutes.
    //route.push(`/homepage/${encodeURIComponent(user_id)}/checkout`);
  }
  const total_checked_products = calculateCheckedProducts();

  const total_checked_price = calculateTotalPrice();

  const total_product =
    cart && cart.shop
      ? cart.shop.reduce((total, shop) => total + shop.product.length, 0)
      : 0;

  const [products, setProducts] = useState(null);

  useEffect(() => {
    async function fetchingData() {
      const response = await fetch(`/api/cart?user_id=${user_id}`);
      const data = await response.json();
      setProducts(data);
    }
    fetchingData();
  }, []);
  useEffect(() => {
    console.log("products: ", products);
    const groupedProducts =
      products &&
      products.reduce((acc, product) => {
        let foundIndex = acc.findIndex(
          (item) => item.Seller_ID === product.Seller_ID
        );
        if (foundIndex === -1) {
          acc.push({
            Seller_ID: product.Seller_ID,
            check: false,
            product: [{ ...product, check: false }],
          });
        } else {
          acc[foundIndex].product.push({ ...product, check: false });
        }
        return acc;
      }, []);

    setCart({ shop: groupedProducts });
  }, [products]);
  useEffect(() => {
    console.log("cart: ", cart);
  }, [cart]);

  async function calculateTotalPriceDB() {
    const response = await fetch(
      `/api/calculate_cart_price?user_id=${user_id}`
    );
    const data = await response.json();
    setTotalCartPrice(data.TotalPrice);
  }

  useEffect(() => {
    console.log("total price: ", totalCartPrice);
  }, [totalCartPrice]);

  return (
    <div className="cart_big_container">
      <div className="cart_header">
        <div className="cart_header_left_section">
          <input type="checkbox"></input>
          <p>San pham</p>
        </div>
        <div className="cart_header_right_section">
          <p>Đơn giá</p>
          <p>So luong</p>
          <p>Thanh tien</p>
          <p>Thao tac</p>
        </div>
      </div>
      {!cart ||
        (!Array.isArray(cart.shop) && (
          <div>
            <p>Loading...</p>
          </div>
        ))}
      {cart &&
        Array.isArray(cart.shop) &&
        cart.shop.map((shop, shopIndex) => {
          return (
            <div className="cart_shop_container">
              <div className="cart_shop_header">
                <input
                  type="checkbox"
                  checked={shop.check}
                  onClick={() => check_shop_item(shopIndex)}
                ></input>
                <p>{shop.Seller_ID}</p>
              </div>
              {shop.product.map((product, productIndex) => {
                return (
                  <div className="cart_product_container">
                    <div className="cart_prodcut_container_left_section">
                      <input
                        type="checkbox"
                        checked={product.check}
                        onClick={() =>
                          check_product_item(shopIndex, productIndex)
                        }
                      ></input>
                      <Image
                        src={
                          product.images && product.images[0]
                            ? product.images[0]
                            : "/next.svg"
                        }
                        alt="product_img"
                        width={100}
                        height={100}
                      ></Image>
                      <p>{product.Product_Name}</p>
                    </div>
                    <div className="cart_prodcut_container_right_section">
                      <p>{product.Product_price}</p>
                      <div className="cart_quantity_container">
                        <button
                          onClick={() => sub_quantity(shopIndex, productIndex)}
                        >
                          <Image
                            src="/sub_icon.png"
                            width={20}
                            height={20}
                            alt="sub_icon"
                          />
                        </button>
                        <p>{product.Quantity}</p>
                        <button
                          onClick={() => {
                            add_quantity(shopIndex, productIndex);
                          }}
                        >
                          <Image
                            src="/plus_icon.png"
                            width={20}
                            height={20}
                            alt="plus icon"
                          />
                        </button>
                      </div>
                      <p className="total_price_cart">
                        {product.Product_price * product.Quantity}
                      </p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          delete_product(shopIndex, productIndex);
                        }}
                      >
                        <Image
                          src="/trash.png"
                          height={20}
                          width={20}
                          alt="delete_img"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          columnGap: "20px",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          width: "50%",
          borderRadius: "10px",
        }}
      >
        <p style={{ color: "#d62828" }}>Calculate total price of your cart:</p>
        <div>
          {totalCartPrice ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: "10px",
              }}
            >
              <p>{totalCartPrice}</p>
              <button onClick={() => setTotalCartPrice(null)}>Reset</button>
            </div>
          ) : (
            <button onClick={calculateTotalPriceDB}>Calculate</button>
          )}
        </div>
      </div>
      <div className="cart_checkout_container">
        <div className="cart_checkout_container_left">
          <input
            type="checkbox"
            checked={checkdedAllProduct}
            onClick={checkAllProducts}
          ></input>
          <p>Chon tat ca ({total_product}) san pham</p>
        </div>
        <div className="cart_checkout_container_right">
          <p>Tong thanh toan({total_checked_products} san pham):</p>
          <p className="total_price_cart_checkout">{total_checked_price}</p>
          <button onClick={handle_checkout}>Thanh toan</button>
        </div>
      </div>
      {waiting_for_check && (
        <div className="overlay_cart">
          <div className="checkbox_container_cart">
            <p>Delete {name_product_want_to_delete}?</p>
            <div>
              <button className="btn_cancel_cart_check" onClick={handle_cancel}>
                Cancel
              </button>
              <button className="btn_delete_cart_check" onClick={handle_delete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
