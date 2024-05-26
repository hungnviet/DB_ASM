import { NextResponse } from "next/server";
import createDbConnection from "@/config/dg";
const db = await createDbConnection("root", "hung18201006");

export async function POST(req) {
  const data = await req.json();
  const {
    product_name,
    product_description,
    seller_id,
    percentage_sale,
    product_price,
    image,
  } = data;
  const sql =
    "INSERT INTO PRODUCT (Product_Name, Description, Seller_ID, Discount, Product_price) VALUES ('" +
    product_name +
    "', '" +
    product_description +
    "', '" +
    seller_id +
    "', '" +
    percentage_sale +
    "', '" +
    product_price +
    "')";
  const sql2 =
    "SELECT Product_ID FROM PRODUCT WHERE Seller_ID = '" +
    seller_id +
    "' ORDER BY Product_ID DESC LIMIT 1;";
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        db.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            const product_id = result[0].Product_ID;
            image.forEach((element) => {
              const { image_url } = element;
              const sql3 =
                "INSERT INTO PRODUCT_IMAGE (Product_ID, Image_URL) VALUES ('" +
                product_id +
                "', '" +
                image_url +
                "')";
              db.query(sql3, (err, result) => {
                if (err) {
                  console.log(err);
                  reject(err);
                }
              });
            });
            resolve(
              NextResponse.json({ message: "Product added successfully" })
            );
          }
        });
      }
    });
  });
}

export async function PUT(req) {
  const data = await req.json();
  const {
    Product_ID,
    Product_Name,
    Description,
    Seller_ID,
    Percentage_sale,
    Product_price,
    Discount,
  } = data;

  const sql1 =
    "UPDATE PRODUCT SET Product_Name = '" +
    Product_Name +
    "', Description = '" +
    Description +
    "', Seller_ID = '" +
    Seller_ID +
    "', Discount = '" +
    Discount +
    "', Product_price = '" +
    Product_price +
    "' WHERE Product_ID = '" +
    Product_ID +
    "'";
  return new Promise((resolve, reject) => {
    db.query(sql1, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(NextResponse.json({ message: "Product updated successfully" }));
      }
    });
  });
}

export async function DELETE(req) {
  const data = await req.json();
  const { product_id } = data;
  const sql1 = `DELETE FROM PRODUCT WHERE Product_ID='${product_id}'`;
  return new Promise((resolve, reject) => {
    db.query(sql1, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        NextResponse.json({ message: "Product deleted successfully" });
      }
    });
  });
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const product_id = searchParams.get("product_id");
  const sql = `SELECT * FROM PRODUCT WHERE Product_ID = '${product_id}'`;
  const sql2 = `SELECT * FROM PRODUCT_IMAGE WHERE Product_ID = '${product_id}'`;
  const sql3 = `SELECT GetAverageProductRating('${product_id}') as rating`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        db.query(sql2, (err, result2) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            result[0].image = result2.map((element) => element.Image_URL);

            db.query(sql3, (err, result3) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                result[0].rating = result3[0].rating;
                resolve(NextResponse.json(result));
              }
            });
          }
        });
      }
    });
  });
}
