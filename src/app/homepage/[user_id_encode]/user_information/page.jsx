"use client";
import { useState, useEffect } from "react";
import "./user_infor.css";
import Image from "next/image";
export default function Page({ params }) {
  const { user_id_encode } = params;
  const [user, setUser] = useState(null);
  const user_id = decodeURIComponent(user_id_encode);
  const [isChangeName, setIsChangeName] = useState(false);
  const [isChangeTelephone, setIsChangeTelephone] = useState(false);
  const [isChangeAddress, setIsChangeAddress] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTelephone, setNewTelephone] = useState("");
  const [newAddress, setNewAddress] = useState("");

  function ChangeName(name) {
    setIsChangeName(false);
    const nameParts = name.split(" ");
    const FName = nameParts[0];
    const LName = nameParts.slice(1).join(" ");

    setUser({ ...user, FName, LName });
  }

  function ChangeTelephone(telephone) {
    setIsChangeTelephone(false);
    setUser({ ...user, Phone_Number: telephone });
  }

  function ChangeAddress(address) {
    setIsChangeAddress(false);
    setUser({ ...user, Address: address });
  }

  async function save() {
    const data = {
      FName: user.FName,
      LName: user.LName,
      Phone_Number: user.Phone_Number,
      Address: user.Address,
      Account_ID: user.Account_ID,
      Email: user.Email,
    };
    const response = await fetch(`/api/user_information`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      alert("User information updated");
    } else {
      alert("Failed to update user information");
    }
  }
  useEffect(() => {
    fetch(`/api/navbar_information?user_id=${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data[0]);
        console.log(data[0]);
      });
    console.log(user_id);
  }, []);

  useEffect(() => {
    if (user) {
      setNewName(user.FName + " " + user.LName);
      setNewTelephone(user.Phone_Number);
      setNewAddress(user.Address);
    }
  }, [user]);
  return (
    <div className="user_information_container_page">
      <h3>User information</h3>
      <div className="user_infor_page_information_container">
        <div className="user_infor_page_information">
          <div className="user_infor_page_label">User name</div>
          <div className="user_infor_page_value">
            <div className="user_infor_each_value">
              {isChangeName ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    ChangeName(newName);
                  }}
                >
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </form>
              ) : user ? (
                user.FName + " " + user.LName
              ) : (
                "loading"
              )}
            </div>
          </div>
        </div>
        <div className="user_infor_page_information">
          <div className="user_infor_page_label">Email</div>
          <div className="user_infor_page_value" style={{ fontWeight: "bold" }}>
            {user ? user.Email : "loading"}
          </div>
        </div>
        <div className="user_infor_page_information">
          <div className="user_infor_page_label">Telephone</div>
          <div className="user_infor_page_value">
            <div className="user_infor_each_value">
              {isChangeTelephone ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    ChangeTelephone(newTelephone);
                  }}
                >
                  <input
                    type="text"
                    value={newTelephone}
                    onChange={(e) => setNewTelephone(e.target.value)}
                  />
                </form>
              ) : user ? (
                user.Phone_Number
              ) : (
                "loading"
              )}
              <div>
                <button onClick={() => setIsChangeTelephone(true)}>
                  <Image
                    src="/edit_user_in4.png"
                    width={20}
                    height={20}
                    alt="edit icon"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="user_infor_page_information">
          <div className="user_infor_page_label">Address</div>
          <div className="user_infor_page_value">
            <div className="user_infor_each_value">
              {isChangeAddress ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    ChangeAddress(newAddress);
                  }}
                >
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                </form>
              ) : user ? (
                user.Address
              ) : (
                "loading"
              )}
              <div>
                <button onClick={() => setIsChangeAddress(true)}>
                  <Image
                    src="/edit_user_in4.png"
                    width={20}
                    height={20}
                    alt="edit icon"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <button className="save_change" onClick={save}>
          Save Change
        </button>
      </div>
    </div>
  );
}
