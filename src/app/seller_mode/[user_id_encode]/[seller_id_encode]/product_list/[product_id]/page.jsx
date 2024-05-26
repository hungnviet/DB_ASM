"use client";
import "../../upload_product/page.css";
import { useEffect, useState } from "react";
export default function page({ params }) {
  const { product_id } = params;
  const [productDetail, setProductDetail] = useState({});

  useEffect(() => {
    async function fetchProductDetail() {
      const data = await fetch(`/api/product?product_id=${product_id}`);
      if (data.ok) {
        const result = await data.json();
        console.log(result);
        setProductDetail(result[0]);
      }
    }
    fetchProductDetail();
  }, []);
  function setDescription(value) {
    setProductDetail((prev) => ({ ...prev, Description: value }));
  }
  function setPrice(value) {
    setProductDetail((prev) => ({ ...prev, Product_price: value }));
  }
  function setName(value) {
    setProductDetail((prev) => ({ ...prev, Product_Name: value }));
  }
  function setPercentage(value) {
    setProductDetail((prev) => ({
      ...prev,
      Discount: value,
    }));
  }
  async function UPDATE() {
    productDetail.Product_price = parseFloat(productDetail.Product_price);
    productDetail.Percentage_sale = parseFloat(productDetail.Percentage_sale);
    console.log(productDetail);
    const data = await fetch(`/api/product`, {
      method: "PUT",
      body: JSON.stringify(productDetail),
    });
    if (data.ok) {
      const result = await data.json();
      console.log(result);
      alert("Update successfully");
    } else {
      alert("Update failed");
    }
  }
  return (
    <div className="upload_product_big_container">
      <div className="upload_product_container">
        <h3>Product Detail</h3>
        <div className="input_name">
          <h3>Name</h3>
          <input
            type="text"
            value={productDetail.Product_Name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input_price">
          <h3>Sale option</h3>
          <div
            style={{ display: "flex", flexDirection: "row", columnGap: "10px" }}
          >
            <p>Percentage of sale</p>
            <input
              type="number"
              value={productDetail.Discount}
              onChange={(e) => setPercentage(e.target.value)}
            ></input>
          </div>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>¥ per</th>
                <th>Unit</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    value={productDetail.Product_price}
                    placeholder="Ex: 100"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </td>
                <td></td>
                <td>
                  <input
                    type="text"
                    value="1 product"
                    placeholder="Ex: package of 1.5 kg"
                  />
                </td>
                {/* <td>
                    <button onClick={() => deleteRow(index)}>Delete</button>
                  </td> */}
              </tr>
            </tbody>
          </table>
          {/* <button onClick={addRow}>Add row</button> */}
        </div>
        <div className="input_description">
          <h3>Description</h3>
          <textarea
            value={productDetail.Description ? productDetail.Description : ""}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <h3>Product Image</h3>
          <div className="img_array">
            {productDetail.image &&
              productDetail.image.map((image, index) => (
                <div className="img_container">
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="product-image"
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="submit_button">
          <button onClick={UPDATE}>Update</button>
        </div>
      </div>
    </div>
  );
}
