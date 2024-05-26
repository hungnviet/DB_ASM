import { NextResponse } from "next/server";
import createDbConnection from "@/config/dg";
const db = await createDbConnection("root", "hung18201006");

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const user_id = searchParams.get("user_id");
  const select_cart_id = `SELECT Cart_ID FROM CART WHERE ACCOUNT_ID = (SELECT ACCOUNT_ID FROM USER WHERE User_ID = '${user_id}')`;

  return new Promise((resolve, reject) => {
    db.query(select_cart_id, (err, result) => {
      {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          const cart_id = result[0].Cart_ID;
          const sql = `SELECT CalculateCartTotalPrice('${cart_id}') AS TotalPrice`;
          db.query(sql, (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(NextResponse.json(result[0]));
            }
          });
        }
      }
    });
  });
}
