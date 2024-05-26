import { NextResponse } from "next/server";
import createDbConnection from "@/config/dg";
const db = await createDbConnection("root", "hung18201006");
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const user_id = searchParams.get("user_id");
  const sql1 = `SELECT Account_ID FROM USER WHERE User_ID = "${user_id}"`;
  return new Promise((resolve, reject) => {
    db.query(sql1, (err, result1) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const Account_ID = result1[0].Account_ID;
        const sql2 = `SELECT Cart_ID FROM CART WHERE Account_ID = "${Account_ID}"`;
        db.query(sql2, (err, result2) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            const Cart_ID = result2[0].Cart_ID;
            const sql3 = `SELECT * FROM ORDER_TABLE WHERE Cart_ID = "${Cart_ID}"`;
            console.log(sql3);
            db.query(sql3, (err, result3) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                const formattedResult = result3.map((row) => ({
                  ...row,
                  Creation_date: new Date(row.Creation_date)
                    .toISOString()
                    .split("T")[0],
                  Expected_date: new Date(row.Expected_date)
                    .toISOString()
                    .split("T")[0],
                }));
                console.log(formattedResult);
                resolve(NextResponse.json(formattedResult));
              }
            });
          }
        });
      }
    });
  });
}
