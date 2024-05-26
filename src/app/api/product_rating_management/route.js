import createDbConnection from "@/config/dg";
import { parse } from "url";
import { NextResponse } from "next/server";
export async function GET(req) {
  const { query } = parse(req.url, true);
  const user_id = query.user_id;
  console.log(user_id);
  let db;
  if (user_id == "4efd2254-f6f4-4be6-bf62-687dd61a3c06") {
    db = await createDbConnection("admin", "h");
  } else {
    db = await createDbConnection("usertemp", "h");
  }
  const sql = "select * from Product_RATE";
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        resolve(NextResponse.json({ error: err.sqlMessage }));
      } else {
        resolve(NextResponse.json(result));
      }
    });
  });
}
