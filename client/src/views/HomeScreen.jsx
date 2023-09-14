import React from "react";
import NavbarTop from "../components/NavbarTop";
import ProductCard from "../components/ProductCard";
import ProductList from "../components/ProductList";

export default function HomeScreen() {
  return (
    <div>
      <NavbarTop />
      <ProductList />
    </div>
  );
}
