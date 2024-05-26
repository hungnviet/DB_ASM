import createDbConnection from "@/config/dg";
import { parse } from "url";
import { NextResponse } from "next/server";
export async function GET(req) {
  const { query } = parse(req.url, true);
  const user_id = query.user_id;
  console.log(user_id);
  if (user_id == "4efd2254-f6f4-4be6-bf62-687dd61a3c06") {
    const db = await createDbConnection("admin", "h");
    const sql = "SELECT * FROM USER";
    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(
          NextResponse.json({
            Users: result,
          })
        );
      });
    });
  } else {
    const db = await createDbConnection("usertemp", "h");
    const sql = "SELECT * FROM USER";
    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(
          NextResponse.json({
            Users: result,
          })
        );
      });
    });
  }
}
