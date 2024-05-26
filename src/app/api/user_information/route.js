import { NextResponse } from "next/server";
import createDbConnection from "@/config/dg";
const db = await createDbConnection("root", "hung18201006");

export async function POST(req) {
  const db = await createDbConnection();
  const data = await req.json();
  const {
    Phone_Number,
    Address,
    Email,
    FName,
    LName,
    Boolean_Customer,
    Boolean_Seller,
    Seller_ID,
    Date_of_Birth,
    User_ID,
    password,
  } = data;
  const sql = `INSERT INTO USER(Phone_Number, Address, Email, FName, LName, Boolean_Customer, Boolean_Seller, Seller_ID, Date_of_Birth, User_ID,Account_password) VALUES ('${Phone_Number}', '${Address}', '${Email}', '${FName}', '${LName}', ${Boolean_Customer}, ${Boolean_Seller}, '${Seller_ID}', '${Date_of_Birth}', '${User_ID}', '${password}')`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(NextResponse.json({ message: "User information added" }));
      }
    });
  });
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const user_id = searchParams.get("user_id");
  const db = await createDbConnection();
  // Use parameterized query to prevent SQL injection
  const sql = `SELECT * FROM USER WHERE User_ID = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [user_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length === 0) {
          resolve(NextResponse.json({ message: "User not found" }));
        } else {
          resolve(NextResponse.json(result));
        }
      }
    });
  });
}

export async function PUT(req) {
  const data = await req.json();
  const { Email, Phone_Number, Address, Account_ID } = data;
  const sql = `Call UpdateUserName_Address_Phone('${Account_ID}','${Address}','${Phone_Number}','${Email}')`;
  console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(NextResponse.json({ message: "User information updated" }));
      }
    });
  });
}
