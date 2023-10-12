import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";
import "../styles/ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const refresh = searchParams.get("refresh");

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data.data);
      console.log("Products have been received!");
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (refresh === "true") {
      fetchData(); 
      searchParams.delete("refresh");
      navigate({ search: searchParams.toString() });
    }
  }, [location.search, refresh, navigate, searchParams]);

  useEffect(() => {
    fetchData(); 
  }, [refresh]);

  console.log(products);

  return (
    <div>
      <div className="productListContainer">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product}/>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
