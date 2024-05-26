"use client";
import { useEffect, useState } from "react";
import "./order_managment.css";
import { useRouter } from "next/navigation";
export default function Page({ params }) {
  const route = useRouter();
  const { user_id_encode } = params;
  const user_id = decodeURIComponent(user_id_encode);
  const [order, setOrder] = useState(null);
  useEffect(() => {
    async function fetching() {
      const response = await fetch(`/api/user_order?user_id=${user_id}`);
      const data = await response.json();
      console.log(data);
      setOrder(data);
    }
    fetching();
  }, []);
  return (
    <div className="order_management_page_container">
      <h3>Order management</h3>
      <div className="order_management_in4">
        <div className="field_bar_order_management">
          <div>Created date</div>
          <div>Expected date</div>
          <div>Seller Name</div>
          <div>Total Price</div>

          <div>Status</div>
          <div>Actions</div>
        </div>
        {order &&
          order.map((item, index) => (
            <div className="field_bar_order_management" key={index}>
              <div>
                {new Date(item.Creation_date).toISOString().split("T")[0]}
              </div>
              <div>
                {new Date(item.Expected_date).toISOString().split("T")[0]}
              </div>
              <div>{item.Seller_ID}</div>
              <div>{item.total_price}</div>
              <div>{item.State}</div>
              <div>
                <button
                  onClick={() => {
                    route.push(
                      `/homepage/${encodeURIComponent(
                        user_id
                      )}/order_managment/${item.Order_ID}`
                    );
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
