"use client";
import "./sign_in.css";
import { signIn, confirmSignIn } from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
const AWS = require("aws-sdk");
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
AWS.config.update({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
});
const cognito = new AWS.CognitoIdentityServiceProvider();
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  // Amplify.configure({
  //   Auth: {
  //     Cognito: {
  //       userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  //       userPoolId: process.env.NEXT_PUBLIC_AWS_Userpool_ID,
  //       loginWith: {
  //         // Optional
  //         oauth: {
  //           domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
  //           scopes: [
  //             "openid email phone profile aws.cognito.signin.user.admin ",
  //           ],
  //           redirectSignIn: ["http://localhost:3000/", "https://example.com/"],
  //           redirectSignOut: ["http://localhost:3000/", "https://example.com/"],
  //           responseType: "code",
  //         },
  //         username: "false",
  //         email: "true", // Optional
  //         phone: "false", // Optional
  //       },
  //     },
  //   },
  // });
  async function check_submit(e) {
    e.preventDefault();
    // const getUserParams = {
    //   UserPoolId: process.env.NEXT_PUBLIC_AWS_Userpool_ID,
    //   Username: email,
    // };
    // if (email === "") {
    //   setErr("Please enter your email");
    //   return;
    // } else if (password === "") {
    //   setErr("Please enter your password");
    //   return;
    // } else {
    //   setErr("");

    //   await signIn({
    //     username: email, // use email as the username
    //     password,
    //     options: {
    //       authFlowType: "USER_PASSWORD_AUTH",
    //     },
    //   })
    //     .then(async (user) => {
    //       // declare this function as async
    //       const getUserResult = await cognito
    //         .adminGetUser(getUserParams)
    //         .promise();
    //       const User_ID = getUserResult.UserAttributes.find(
    //         (attr) => attr.Name === "sub"
    //       ).Value;
    //       const data =
    //         email === "nvh100904@gmail.com"
    //           ? {
    //               name: "usertemp",
    //               password: "h",
    //             }
    //           : {
    //               name: "admin",
    //               password: "h",
    //             };
    //       const connect = await fetch("/api/connect", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(data),
    //       });
    //       const connect_res = await connect.json();
    //       console.log(connect_res);
    //       router.push(`/homepage/${encodeURIComponent(User_ID)}`);
    //     })
    //     .catch((err) => {
    //       setErr(err.message || JSON.stringify(err));
    //     });
    const data = {
      email,
      password,
    };
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const res = await response.json();
      if (res.message === "Login success") {
        router.push(`/homepage/${encodeURIComponent(res.User_ID)}`);
      } else {
        setErr("Invalid email or password");
      }
    } else {
      setErr("Invalid email or password");
    }
  }
  return (
    <div className="container">
      <p className="helo"> If you already have the account, just login!</p>
      <form className="form_container" onSubmit={check_submit}>
        <h2>Log In</h2>
        <div className="input_container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <p className="err_msg_logIn">{err}</p>
        </div>
        <button type="submit">Log in</button>
        <div className="forgot_password">
          <Link href="/sign_in/forgot_password">Forgot Password</Link>
        </div>
      </form>
    </div>
  );
}
