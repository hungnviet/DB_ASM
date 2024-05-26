import createDbConnection from "@/config/dg";
const db = await createDbConnection("root", "hung18201006");
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const Seller_ID = searchParams.get("Seller_ID");
  const sql = `SELECT Product_ID from PRODUCT WHERE Seller_ID = ${Seller_ID} `;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const productIds = result.map((item) => item.Product_ID);
        resolve(NextResponse.json(productIds));
      }
    });
  });
}
