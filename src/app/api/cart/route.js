import { NextResponse } from "next/server";
import createDbConnection from "@/config/dg";
const db = await createDbConnection("root", "hung18201006");

export async function POST(req) {
  const data = await req.json();
  const { Product_ID, Quantity, User_ID } = data;

  const getAccountIdSql = "SELECT ACCOUNT_ID FROM USER WHERE User_ID = ?";
  const getCartIdSql = "SELECT Cart_ID FROM CART WHERE ACCOUNT_ID = ?";
  const insertProductSql =
    "INSERT INTO PRODUCT_CART(Product_ID, Quantity, Cart_ID) VALUES (?, ?, ?)";
  const checkProductSql =
    "SELECT * FROM PRODUCT_CART WHERE Product_ID = ? AND Cart_ID = ?";

  return new Promise((resolve, reject) => {
    db.query(getAccountIdSql, [User_ID], (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (!result[0]) {
          reject(new Error("User not found"));
        } else {
          const ACCOUNT_ID = result[0].ACCOUNT_ID;
          db.query(getCartIdSql, [ACCOUNT_ID], (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              const Cart_ID = result[0].Cart_ID;
              db.query(
                checkProductSql,
                [Product_ID, Cart_ID],
                (err, result) => {
                  if (err) {
                    console.log(err);
                    reject(err);
                  } else if (result.length > 0) {
                    const updatedQuantity = result[0].Quantity + Quantity;
                    const updateQuantitySql =
                      "UPDATE PRODUCT_CART SET Quantity = ? WHERE Product_ID = ? AND Cart_ID = ?";
                    db.query(
                      updateQuantitySql,
                      [updatedQuantity, Product_ID, Cart_ID],
                      (err, result) => {
                        if (err) {
                          console.log(err);
                          reject(err);
                        } else {
                          resolve(
                            NextResponse.json({
                              message:
                                "Product already in cart have update quantity",
                            })
                          );
                        }
                      }
                    );
                  } else {
                    db.query(
                      insertProductSql,
                      [Product_ID, Quantity, Cart_ID],
                      (err, result) => {
                        if (err) {
                          console.log(err);
                          reject(err);
                        } else {
                          resolve(
                            NextResponse.json({
                              message: "Product added to cart",
                            })
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      }
    });
  });
}

export async function PUT(req) {
  const data = await req.json();
  const { Product_ID, Quantity, User_ID } = data;

  const getAccountIdSql = "SELECT ACCOUNT_ID FROM USER WHERE User_ID = ?";
  const getCartIdSql = "SELECT Cart_ID FROM CART WHERE ACCOUNT_ID = ?";
  const updateProductSql =
    "UPDATE PRODUCT_CART SET Quantity = ? WHERE Product_ID = ? AND Cart_ID = ?";

  return new Promise((resolve, reject) => {
    db.query(getAccountIdSql, [User_ID], (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const ACCOUNT_ID = result[0].ACCOUNT_ID;
        db.query(getCartIdSql, [ACCOUNT_ID], (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            const Cart_ID = result[0].Cart_ID;
            db.query(
              updateProductSql,
              [Quantity, Product_ID, Cart_ID],
              (err, result) => {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  resolve(
                    NextResponse.json({ message: "Product quantity updated" })
                  );
                }
              }
            );
          }
        });
      }
    });
  });
}

export async function DELETE(req) {
  const data = await req.json();
  const { Product_ID_list, User_ID } = data;
  const select_cartID = `SELECT Cart_ID FROM CART WHERE Account_ID = (SELECT Account_ID FROM USER WHERE User_ID = '${User_ID}')`;
  return new Promise((resolve, reject) => {
    db.query(select_cartID, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const Cart_ID = result[0].Cart_ID;
        const sql = `DELETE FROM PRODUCT_CART WHERE Product_ID IN (?) AND Cart_ID = '${Cart_ID}'`;
        db.query(sql, [Product_ID_list], (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(
              NextResponse.json({ message: "Products removed from cart" })
            );
          }
        });
      }
    });
  });
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const user_id = searchParams.get("user_id");
  const select_cart_id = `SELECT Cart_ID FROM CART WHERE ACCOUNT_ID = (SELECT ACCOUNT_ID FROM USER WHERE User_ID = '${user_id}')`;

  return new Promise((resolve, reject) => {
    db.query(select_cart_id, (err, result) => {
      {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          const cart_id = result[0].Cart_ID;
          const sql = `
          SELECT PRODUCT.*, PRODUCT_CART.Quantity
          FROM PRODUCT_CART
          INNER JOIN PRODUCT ON PRODUCT_CART.Product_ID = PRODUCT.Product_ID
          WHERE PRODUCT_CART.Cart_ID = '${cart_id}'
        `;
          db.query(sql, async (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              const finalResult = await Promise.all(
                result.map(async (product) => {
                  const sql2 = `SELECT Image_URL FROM PRODUCT_IMAGE WHERE Product_ID = '${product.Product_ID}'`;
                  return new Promise((resolve, reject) => {
                    db.query(sql2, (err, result2) => {
                      if (err) {
                        console.log(err);
                        reject(err);
                      } else {
                        product.images = result2.map((item) => item.Image_URL);
                        resolve(product);
                      }
                    });
                  });
                })
              );
              resolve(NextResponse.json(finalResult));
            }
          });
        }
      }
    });
  });
}
