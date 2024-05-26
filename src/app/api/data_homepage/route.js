import { NextResponse } from "next/server";
import createDbConnection from "@/config/dg";
const db = await createDbConnection("root", "hung18201006");
export async function GET() {
  const sql = `SELECT * FROM PRODUCT`;
  return new Promise((resolve, reject) => {
    db.query(sql, async (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const finalResult = await Promise.all(
          result.map(async (item) => {
            const sql2 = `SELECT Image_URL FROM PRODUCT_IMAGE WHERE Product_ID='${item.Product_ID}'`;
            return new Promise((resolve, reject) => {
              db.query(sql2, (err, result2) => {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  item.images = result2.map((item) => item.Image_URL);
                  resolve(item);
                }
              });
            });
          })
        );
        resolve(NextResponse.json(finalResult));
      }
    });
  });
}
