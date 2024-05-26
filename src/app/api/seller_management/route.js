import createDbConnection from "@/config/dg";
import { NextResponse } from "next/server";
export async function POST(req) {
  const data = await req.json();
  const { user_id, start_date, end_date } = data;
  if (user_id == "4efd2254-f6f4-4be6-bf62-687dd61a3c06") {
    const db = await createDbConnection("admin", "h");
    const sql = `call ListSellersBySalesRevenue('${start_date}','${end_date}')`;
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
  } else {
    const db = await createDbConnection("usertemp", "h");
    const sql = "call ListSellersBySalesRevenue()";
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
}
