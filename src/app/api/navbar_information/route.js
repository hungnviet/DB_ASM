import { NextResponse } from "next/server";
import createDbConnection from "@/config/dg";

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const user_id = searchParams.get("user_id");
  const sql = `SELECT * FROM USER WHERE User_ID = '${user_id}'`;
  const db = await createDbConnection("root", "hung18201006");
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const sql2 = `SELECT * FROM CART WHERE Account_ID='${result[0].Account_ID}'`;
        db.query(sql2, (err, result2) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            result[0].Cart_ID = result2[0].Cart_ID;
            const cart_id = result2[0].Cart_ID;
            const sql3 =
              "SELECT Quantity FROM CART WHERE Cart_ID = '" + cart_id + "'";
            db.query(sql3, (err, result3) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                let total_quantity = 0;
                total_quantity = result3[0].Quantity;
                result[0].Total_Cart_Quantity = total_quantity;
                resolve(NextResponse.json(result));
              }
            });
          }
        });
      }
    });
  });
}
