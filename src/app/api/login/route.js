import { NextResponse } from "next/server";
import createDbConnection from "@/config/dg";
const db = await createDbConnection("root", "hung18201006");
export async function POST(req) {
  const data = await req.json();
  const { email, password } = data;
  const sql1 = `SELECT User_ID FROM USER WHERE Email = '${email}' AND Account_password = '${password}'`;
  console.log(sql1);
  return new Promise((resolve, reject) => {
    db.query(sql1, (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length > 0) {
          resolve(
            NextResponse.json({
              message: "Login success",
              User_ID: result[0].User_ID,
            })
          );
        } else {
          resolve(NextResponse.json({ message: "Login failed" }));
        }
      }
    });
  });
}
