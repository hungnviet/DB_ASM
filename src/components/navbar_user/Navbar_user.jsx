"use client";
import Link from "next/link";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import "./navbar_user.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_AWS_Userpool_ID, // Your User Pool ID
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID, // Your Client ID
};
export default function NavbarUser({ user_id }) {
  // function signOutUser() {
  //   const userPool = new CognitoUserPool(poolData);
  //   const cognitoUser = userPool.getCurrentUser();
  //   console.log("hih");
  //   if (cognitoUser != null) {
  //     cognitoUser.signOut();
  //     router.push("/sign_in");
  //   }
  // }
  const [email, setemail] = useState("");

  const [show_option, set_show_option] = useState(false);
  const [search_input, set_search_input] = useState("");
  const [totalCartQuantity, setTotalCartQuantity] = useState(0);
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState({});
  const router = useRouter();
  function handle_show_option() {
    set_show_option(!show_option);
  }
  async function handle_search(e) {
    e.preventDefault();
    alert("update search function in the future");
    set_search_input("");
    // set_search_input("");
    // router.push(
    //   `/homepage/${encodeURIComponent(user_id)}/search_result/${search_input}`
    // );
  }

  async function register_as_seller() {
    if (userData.Boolean_Seller) {
      router.push(
        `/seller_mode/${encodeURIComponent(user_id)}/${encodeURIComponent(
          userData.Seller_ID
        )}/dashboard`
      );
    } else {
      router.push(
        `/seller_mode/${encodeURIComponent(user_id)}/register_for_sales_account`
      );
    }
  }
  // useEffect(() => {
  //   const userPool = new CognitoUserPool(poolData);
  //   const cognitoUser = userPool.getCurrentUser();

  //   if (cognitoUser != null) {
  //     cognitoUser.getSession((err, session) => {
  //       if (err) {
  //         console.error(err);
  //         return;
  //       }

  //       cognitoUser.getUserAttributes((err, attributes) => {
  //         if (err) {
  //           console.error(err);
  //           return;
  //         }

  //         const nameAttribute = attributes.find(
  //           (attribute) => attribute.Name === "family_name"
  //         );

  //         if (nameAttribute) {
  //           setemail(nameAttribute.Value);
  //         }
  //       });
  //     });
  //   }
  // }, []);
  useEffect(() => {
    fetch(`/api/navbar_information?user_id=${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data[0]);
        console.log(data[0]);
      });
    console.log(user_id);
  }, []);
  return (
    <div className="navbar_user_container">
      <div className="left_section_navbar_container">
        <button
          onClick={() =>
            router.push(`/homepage/${encodeURIComponent(user_id)}`)
          }
        >
          <h3>TPM</h3>
        </button>
      </div>
      <div className="middle_section_navbar_container">
        <form onSubmit={handle_search}>
          <input
            type="text"
            placeholder="Search for products"
            value={search_input}
            onChange={(e) => set_search_input(e.target.value)}
          />
        </form>
      </div>
      <div className="right_section_navbar_container">
        <div>
          <div className="icon_navbar_container">
            <Image
              src="/cart_icon.png"
              width={25}
              height={25}
              alt="cart_icon"
            />
          </div>
          <p>{userData.Total_Cart_Quantity}</p>
        </div>
        <div>
          <div className="icon_navbar_container">
            <Image
              src="/user_icon.png"
              width={25}
              height={25}
              alt="cart_icon"
            />
          </div>
          <p>{userData.LName}</p>
        </div>
        <div>
          <button
            className="icon_navbar_container"
            onClick={handle_show_option}
          >
            <Image
              src="/menu_icon.png"
              width={20}
              height={20}
              alt="cart_icon"
            />
          </button>
        </div>
      </div>
      {show_option && (
        <div className="list_option">
          <Link
            href={`/homepage/${encodeURIComponent(user_id)}/user_information`}
          >
            User information
          </Link>
          <Link href={`/homepage/${encodeURIComponent(user_id)}/cart`}>
            Show your cart
          </Link>
          <Link
            href={`/homepage/${encodeURIComponent(user_id)}/order_managment`}
          >
            Order management
          </Link>
          <button onClick={register_as_seller}>Register as seller</button>
          <button>Log out</button>{" "}
          <Link
            href={`/homepage/${encodeURIComponent(user_id)}/user_management`}
          >
            User management{" "}
          </Link>
          <Link
            href={`/homepage/${encodeURIComponent(user_id)}/seller_management`}
          >
            Seller management{" "}
          </Link>
          <Link
            href={`/homepage/${encodeURIComponent(
              user_id
            )}/product_rating_management`}
          >
            Product Rating{" "}
          </Link>
          <Link
            href={`/homepage/${encodeURIComponent(
              user_id
            )}/customer_cart_management`}
          >
            Customer Cart{" "}
          </Link>
        </div>
      )}
    </div>
  );
}

// Account_ID: "ACC000007"
// Address: "13/19 Khu Phố 6 Phường Tam Hiệp, Biên Hoà Đồng Nai"Boolean_Customer: 1Boolean_Seller:
// 0
// Cart_ID
// :
// "CAR000007"
// Date_of_Birth
// :
// "2004-09-09T17:00:00.000Z"
// Email
// :
// "nvh100904@gmail.com"
// FName
// :
// "Nguyễn"
// LName
// :
// "Hùng"
// Phone_Number
// :
// "0798944343"
// Seller_ID
// :
// ""
// Shop_Name
// :
// null
// Total_Cart_Quantity
// :
// 0
// User_ID
// :
// "08206361-ea2b-417d-b065-d7aa3011ab17"
