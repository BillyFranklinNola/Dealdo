import React, { useState, useEffect } from "react";
import axios from "axios";

function ProductList() {
  const [products, setProducts] = useState([]);
  const apiUrl = "http://localhost:5000/api/products";

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(apiUrl);
        setProducts(response.data.data);
        console.log("Products have been received!");
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
