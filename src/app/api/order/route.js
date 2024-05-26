import { NextResponse } from "next/server";
import createDbConnection from "@/config/dg";
const db = await createDbConnection("root", "hung18201006");
export async function POST(req) {
  const data = await req.json();
  console.log(data);
  const { Seller_ID, Product_List, Address, Cart_ID, User_ID } = data;

  const Creation_date = new Date().toISOString().slice(0, 10);
  let Expected_date = new Date(Creation_date);
  Expected_date.setDate(Expected_date.getDate() + 3);
  Expected_date = Expected_date.toISOString().slice(0, 10);

  const Order_Table_Data = {
    Creation_date: Creation_date,
    Expected_date: Expected_date,
    Cart_ID: Cart_ID,
    Seller_ID: Seller_ID,
    Address: Address,
    State: "waiting confirmation",
  };

  const sql1 = `
  INSERT INTO ORDER_TABLE (Creation_date, Expected_date, Cart_ID, Seller_ID, Address, State)
  VALUES (?, ?, ?, ?, ?, ?)
`;
  const valuesOrderTable = [
    Order_Table_Data.Creation_date,
    Order_Table_Data.Expected_date,
    Order_Table_Data.Cart_ID,
    Order_Table_Data.Seller_ID,
    Order_Table_Data.Address,
    Order_Table_Data.State,
  ];
  return new Promise((resolve, reject) => {
    db.query(sql1, valuesOrderTable, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        const sql2 =
          "SELECT Order_ID FROM ORDER_TABLE WHERE Cart_ID= ? and Seller_ID= ? order by Order_ID desc limit 1";
        db.query(sql2, [Cart_ID, Seller_ID], (err, result) => {
          if (err) {
            console.log(err);
            return reject(err);
          } else {
            const Order_ID = result[0].Order_ID;
            const sql3 = `INSERT INTO ORDER_ITEM (Order_ID, Product_ID, Quantity) VALUES ?`;
            let values = Product_List.map((product) => [
              Order_ID,
              product.product_id,
              product.quantity,
            ]);
            db.query(sql3, [values], (err, result) => {
              if (err) {
                console.log(err);
                return reject(err);
              } else {
                const sqlCalculateTotal = `SELECT CalculateOrderTotalPrice(?) AS Total_Price`;
                const orderIdValue = [Order_ID];
                db.query(sqlCalculateTotal, orderIdValue, (err, result3) => {
                  if (err) {
                    console.log(err);
                    return reject(err);
                  } else {
                    const sqlUpdateTotalPrice = `UPDATE ORDER_TABLE SET Total_Price = ? WHERE Order_ID = ?`;
                    const valuesUpdateTotalPrice = [
                      result3[0].Total_Price,
                      Order_ID,
                    ];
                    db.query(
                      sqlUpdateTotalPrice,
                      valuesUpdateTotalPrice,
                      async (err, result) => {
                        if (err) {
                          console.log(err);
                          return reject(err);
                        } else {
                          try {
                            const Product_ID_list = Product_List.map(
                              (product) => product.product_id
                            );
                            const data = {
                              Product_ID_list: Product_ID_list,
                              User_ID: User_ID,
                            };
                            const response = await fetch(
                              "http://localhost:3000/api/cart",
                              {
                                method: "DELETE",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data),
                              }
                            );
                            resolve(
                              NextResponse.json({
                                Message: "Order created successfully",
                              })
                            );
                          } catch (err) {
                            console.log(err);
                            return reject(err);
                          }
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}

// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = new URLSearchParams(url.searchParams);
//   const temp_order_id = searchParams.get("order_id");
//   const sql1 = `SELECT * FROM ORDER_TABLE WHERE Order_ID = ?`;
//   const sql2 = `SELECT * FROM ORDER_ITEM WHERE Order_ID = ?`;
//   return new Promise((resolve, reject) => {
//     db.query(sql1, [temp_order_id], (err, result1) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       db.query(sql2, [temp_order_id], (err, result2) => {
//         if (err) {
//           console.log(err);
//           return reject(err);
//         }
//         resolve(
//           NextResponse.json({
//             Order: result1[0],
//             Order_Items: result2,
//           })
//         );
//       });
//     });
//   });
// }

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const temp_order_id = searchParams.get("order_id");
  const sql1 = `SELECT * FROM ORDER_TABLE WHERE Order_ID = ?`;
  const sql2 = `SELECT * FROM ORDER_ITEM WHERE Order_ID = ?`;
  const sql3 = `SELECT * FROM PRODUCT WHERE Product_ID = ?`;
  const sql4 = `SELECT * FROM PRODUCT_IMAGE WHERE Product_ID = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql1, [temp_order_id], (err, result1) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      db.query(sql2, [temp_order_id], (err, result2) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        const productPromises = result2.map(
          (item) =>
            new Promise((resolve, reject) => {
              db.query(sql3, [item.Product_ID], (err, result3) => {
                if (err) {
                  console.log(err);
                  return reject(err);
                }
                db.query(sql4, [item.Product_ID], (err, result4) => {
                  if (err) {
                    console.log(err);
                    return reject(err);
                  }
                  resolve({
                    ...item,
                    Product: result3[0],
                    ProductImage: result4[0],
                  });
                });
              });
            })
        );
        Promise.all(productPromises)
          .then((Order_Items) => {
            resolve(
              NextResponse.json({
                Order: result1[0],
                Order_Items,
              })
            );
          })
          .catch(reject);
      });
    });
  });
}

export async function PUT(req) {
  const data = await req.json();
  const { Order_ID, State } = data;
  const sql = `UPDATE ORDER_TABLE SET State = ? WHERE Order_ID = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [State, Order_ID], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(NextResponse.json({ Message: "Order updated successfully" }));
    });
  });
}
