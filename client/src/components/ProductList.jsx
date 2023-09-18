import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data.data);
        console.log("Products have been received!");
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchData();
  }, [refreshKey]);

  return (
    <div>
      <div className="d-flex">
        {products.map((product) => (
          <ProductCard key={product.id} product={product}/>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
