"use client";
import { useState, useEffect } from "react";
import "./page.css";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

export default function ({ params }) {
  const s3 = new AWS.S3();
  const [rows, setRows] = useState([{ price: "", unit: "" }]);
  const [images, setImages] = useState([]);
  const [productname, setProductname] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [percentage_sale, setPercentage_sale] = useState(0);
  const submitproduct = async (e) => {
    console.log("Called");
    try {
      ///Upload files to S3 and get their URLs
      // const imageUrls = await Promise.all(
      //   selectedFiles.map((file, index) => {
      //     console.log(`Uploading file ${index + 1}: ${file.name}`);
      //     const uploadParams = {
      //       Bucket: "databaseasm2", // replace with your bucket name
      //       Key: file.name, // file name to use for S3 object
      //       Body: file,
      //       ACL: "public-read", // if you want the file to be publicly accessible
      //     };

      //     return s3
      //       .upload(uploadParams)
      //       .promise()
      //       .then((data) => data.Location)
      //       .catch((err) => {
      //         console.error("Error uploading file:", err);
      //         return null;
      //       });
      //   })
      // );

      // // Filter out any null URLs (in case of upload errors)
      // const validImageUrls = imageUrls.filter((url) => url !== null);
      // console.log("Image URLs:", validImageUrls);
      // const img_list = validImageUrls.map((url) => {
      //   return { image_url: url };
      // });
      const data = {
        product_name: productname,
        product_description: description,
        seller_id: decodeURIComponent(params.seller_id_encode),
        percentage_sale: percentage_sale,
        product_waranty: 10,
        product_price: rows[0].price,
        image: [],
      };
      console.log("Data:", data);
      try {
        const response = await fetch(`/api/product`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          alert("Product posted successfully!");
        } else {
          alert("Failed to post product!");
          console.log(response);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleImageChange = (e) => {
    const newSelectedFiles = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newSelectedFiles]);

    const fileReaders = newSelectedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders)
      .then((newImages) => {
        setImages((prevImages) => [...prevImages, ...newImages]);
      })
      .catch((error) => {
        console.error("Error reading files:", error);
      });
  };

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  return (
    <div className="upload_product_big_container">
      <div className="upload_product_container">
        <h3>Add new product to your shop</h3>
        <div className="input_name">
          <h3>Name</h3>
          <input
            type="text"
            value={productname}
            onChange={(e) => setProductname(e.target.value)}
          />
        </div>
        <div className="input_price">
          <h3>Sale option</h3>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>$ per</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={row.price}
                      onChange={(e) =>
                        updateRow(index, "price", e.target.value)
                      }
                      placeholder="Ex: 100"
                    />
                  </td>
                  <td></td>
                  <td>
                    <input
                      type="text"
                      value="1 product"
                      style={{ fontWeight: "bold", paddingLeft: "10px" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="input_description">
          <h3>Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <h3>Product Image</h3>
          <input type="file" multiple onChange={handleImageChange} />
          <div className="img_array">
            {images.map((image, index) => (
              <div className="img_container" key={index}>
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="product-image"
                />
                <button
                  onClick={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="submit_button">
          <button onClick={submitproduct}>Posting</button>
        </div>
      </div>
    </div>
  );
}
