import { NextResponse } from "next/server";
import createDbConnection from "@/config/dg";
const db = await createDbConnection("root", "hung18201006");
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const seller_id = searchParams.get("seller_id");
  const sql = `call ListOrdersForSeller('${seller_id}')`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(NextResponse.json(result[0]));
      }
    });
  });
}

export async function PUT(req) {
  const data = await req.json();
  const { Order_ID, State, Expected_date, Creation_date } = data;
  const sql = `call UpdateOrderDates('${Order_ID}','${Creation_date}','${Expected_date}','${State}')`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(NextResponse.json({ message: "Update successfully" }));
      }
    });
  });
}
