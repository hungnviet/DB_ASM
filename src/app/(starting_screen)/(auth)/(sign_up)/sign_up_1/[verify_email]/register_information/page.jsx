"use client";
import { useState } from "react";
import "./register_information.css";
const AWS = require("aws-sdk");
import { useRouter } from "next/navigation";
// AWS.config.update({
//   region: process.env.NEXT_PUBLIC_AWS_REGION,
//   accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
// });

const cognito = new AWS.CognitoIdentityServiceProvider();

export default function RegisterInformation({ params }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const encodeEmail = params.verify_email;
  const email = decodeURIComponent(encodeEmail);
  const route = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    // const userAttributesParams = {
    //   UserPoolId: process.env.NEXT_PUBLIC_AWS_Userpool_ID,
    //   Username: email,
    //   UserAttributes: [
    //     {
    //       Name: "name",
    //       Value: firstName + " " + lastName,
    //     },
    //     {
    //       Name: "gender",
    //       Value: gender,
    //     },
    //     {
    //       Name: "phone_number",
    //       Value: "+84" + phoneNumber.substring(1),
    //     },
    //     {
    //       Name: "address",
    //       Value: address,
    //     },
    //     {
    //       Name: "birthdate",
    //       Value: "2004-09-10",
    //     },
    //   ],
    // };
    // const passwordParams = {
    //   UserPoolId: process.env.NEXT_PUBLIC_AWS_Userpool_ID,
    //   Username: email,
    //   Password: password,
    //   Permanent: true,
    // };
    // const getUserParams = {
    //   UserPoolId: process.env.NEXT_PUBLIC_AWS_Userpool_ID,
    //   Username: email,
    // };
    // let User_ID = "";
    // try {
    //   const [updateUserAttributesResult, setUserPasswordResult, getUserResult] =
    //     await Promise.all([
    //       cognito.adminUpdateUserAttributes(userAttributesParams).promise(),
    //       cognito.adminSetUserPassword(passwordParams).promise(),
    //       cognito.adminGetUser(getUserParams).promise(),
    //     ]);

    //   console.log("User information updated", updateUserAttributesResult);
    //   console.log("User password updated", setUserPasswordResult);
    //   User_ID = getUserResult.UserAttributes.find(
    //     (attr) => attr.Name === "sub"
    //   ).Value;
    //   console.log(
    //     "User ID (sub):",
    //     getUserResult.UserAttributes.find((attr) => attr.Name === "sub").Value
    //   );
    // } catch (err) {
    //   console.error(err.message || JSON.stringify(err));
    //   return;
    // }

    try {
      const connect = await fetch("/api/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "admin", password: "h" }),
      });
      const connect_res = await connect.json();
      console.log(connect_res);
    } catch (err) {
      console.error(err.message || JSON.stringify(err));
      return;
    }

    const newAccount = {
      Phone_Number: phoneNumber,
      Address: address,
      Email: email,
      FName: firstName,
      LName: lastName,
      Boolean_Customer: true,
      Boolean_Seller: false,
      Seller_ID: "",
      Date_of_Birth: dateOfBirth,
      User_ID:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        "user_id",
      password: password,
    };
    try {
      const response = await fetch("../../../api/user_information", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccount),
      });
      if (response.ok) {
        console.log("Account created successfully");
        alert("Account created successfully");
        route.push("/sign_in");
      } else {
        alert("Account created failed");
        console.log(response);
      }
    } catch (err) {
      console.error(err.message || JSON.stringify(err));
    }
  }

  return (
    <div className="register_information_container">
      <h1>Please inform you information for creating account</h1>
      <form className="form_register_information" onSubmit={handleSubmit}>
        <div className="form_register_content">
          <div className="first_block_form_content">
            <div className="left_of_first">
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="right_of_first">
              <div>
                <label>Phone Number</label>
                <input
                  type="text"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="seconde_block_form_content">
            <div className="left_of_second">
              <label>Email</label>
              <p>{email}</p>
            </div>
            <div className="right_of_second">
              <label>Gender</label>
              <div className="option_for_gender">
                <div>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    onChange={(e) => setGender(e.target.value)}
                  ></input>
                  <p>Male</p>
                </div>
                <div>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    onChange={(e) => setGender(e.target.value)}
                  ></input>
                  <p>Female</p>
                </div>
                <div>
                  <p>Date of Birth</p>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="third_block_form_content">
            <div className="left_of_third">
              <label>Password</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="right_of_third">
              <label>Confirm Password</label>
              <input
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="form_register_btn">
          <button className="btn_clear">Clear</button>
          <button className="btn_finish" type="submit">
            Finish
          </button>
        </div>
      </form>
    </div>
  );
}
