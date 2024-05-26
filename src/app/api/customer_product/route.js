import { NextResponse } from "next/server";
import createDbConnection from "@/config/dg";
const db = await createDbConnection("root", "hung18201006");
export async function GET() {
  const sql1 = "SELECT Product_ID FROM PRODUCT WHERE Discount = 0";
  const sql2 = "SELECT Product_ID FROM PRODUCT WHERE Discount > 0";
  return new Promise((resolve, reject) => {
    db.query(sql1, (err, result1) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        db.query(sql2, (err, result2) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            const product_ID_best_seller = result1.map(
              (item) => item.Product_ID
            );
            const product_ID_on_sale = result2.map((item) => item.Product_ID);
            resolve(
              NextResponse.json({ product_ID_best_seller, product_ID_on_sale })
            );
          }
        });
      }
    });
  });
}
