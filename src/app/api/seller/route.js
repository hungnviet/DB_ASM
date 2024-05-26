import { NextResponse } from "next/server";
import createDbConnection from "@/config/dg";
const db = await createDbConnection("root", "hung18201006");
///use for register seller
export async function POST(req) {
  const data = await req.json();
  const user_id = data.user_id;
  const shop_name = data.shop_name;
  const sql1 = `SELECT Account_ID FROM USER WHERE User_ID = '${user_id}'`;
  const result1 = await new Promise((resolve, reject) => {
    db.query(sql1, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  if (!result1[0]) {
    return NextResponse.json({
      message: "No user found with the provided user_id",
    });
  }

  const Account_ID = result1[0].Account_ID;
  const sql = `UPDATE USER SET Boolean_Seller = true WHERE Account_ID = '${Account_ID}'`;
  const sql2 = `SELECT Seller_ID FROM USER WHERE Account_ID = '${Account_ID}'`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        db.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            const Seller_ID = result[0].Seller_ID;
            resolve(
              NextResponse.json({
                message: "create seller success",
                Seller_ID: Seller_ID,
              })
            );
          }
        });
      }
    });
  });
}
