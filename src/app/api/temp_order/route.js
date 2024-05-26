import { NextResponse } from "next/server";
import db from "@/config/dg";
export async function POST(req) {
  const data = await req.json();
  const {
    Temp_order_ID_test,
    Account_ID,
    Seller_ID,
    Address,
    Total_price,
    Product_list,
  } = {
    ...data,
  };
  const sql1 =
    "INSERT INTO TEMP_ORDER_DETAIL (Temp_order_ID,Account_ID, Seller_ID, Address) VALUES ('" +
    Temp_order_ID_test +
    "','" +
    Account_ID +
    "','" +
    Seller_ID +
    "','" +
    Address +
    "')";
  return new Promise((resolve, reject) => {
    db.query(sql1, function (err, result) {
      if (err) {
        console.log(err);
        resolve(NextResponse.error(err));
      } else {
        const sql2 =
          "SELECT Temp_order_ID FROM TEMP_ORDER_DETAIL WHERE Account_ID='" +
          Account_ID +
          "' AND Seller_ID='" +
          Seller_ID +
          "' ORDER BY Temp_order_ID DESC LIMIT 1";
        db.query(sql2, function (err, result) {
          if (err) {
            console.log(err);
            resolve(NextResponse.error(err));
          } else {
            const Temp_order_ID = result[0].Temp_order_ID;
            Product_list.forEach((product) => {
              const {
                Product_ID,
                Quantity,
                Product_Name,
                Product_Price,
                Product_Image,
                Discount,
              } = product;
              const sql3 = `INSERT INTO TEMP_ORDER_ITEM (Temp_order_ID, Product_ID, Quantity, Product_Name,Product_Price,Product_Image,Discount) VALUES (?, ?, ?, ?, ?, ?, ?)`;
              db.query(
                sql3,
                [
                  Temp_order_ID,
                  Product_ID,
                  Quantity,
                  Product_Name,
                  Product_Price,
                  Product_Image,
                  Discount,
                ],
                (err, result) => {
                  if (err) {
                    console.log(err);
                    resolve(NextResponse.error(err));
                  }
                }
              );
            });
            resolve(
              NextResponse.json({
                message: "Products added successfully",
                Temp_order_ID: Temp_order_ID,
              })
            );
          }
        });
      }
    });
  });
}
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const temp_order_id = searchParams.get("temp_order_id");
  const sql1 = `SELECT * FROM TEMP_ORDER_DETAIL WHERE Temp_order_ID = ?`;
  const sql2 = `SELECT * FROM TEMP_ORDER_ITEM WHERE Temp_order_ID = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql1, [temp_order_id], (err, result) => {
      if (err) {
        console.log(err);
        resolve(NextResponse.error(err));
      } else {
        db.query(sql2, [temp_order_id], (err, result2) => {
          if (err) {
            console.log(err);
            resolve(NextResponse.error(err));
          } else {
            const { Temp_order_ID, ...rest } = result[0];
            const Product_list = result2.map(
              ({ Temp_order_ID, ...item }) => item
            );
            const finalResult = {
              ...rest,
              Product_list,
            };
            resolve(NextResponse.json(finalResult));
          }
        });
      }
    });
  });
}
export async function DELETE(req) {
  const data = await req.json();
  const { temp_order_id } = data;
  const sql1 = `DELETE FROM TEMP_ORDER_DETAIL WHERE Temp_order_ID='${temp_order_id}'`;
  return new Promise((resolve, reject) => {
    db.query(sql1, (err, result) => {
      if (err) {
        console.log(err);
        resolve(NextResponse.error(err));
      } else {
        resolve(NextResponse.json({ message: "Order deleted successfully" }));
      }
    });
  });
}
