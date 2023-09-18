import React from 'react'
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';
import NavbarTop from '../components/NavbarTop';

export default function SearchResults() {
  const location = useLocation()
  const searchResults = location.state?.searchResults || [];
  console.log(location.state)
  console.log(searchResults)
  return (
    <div>
      <NavbarTop/>
      <div className="d-flex">
        {searchResults.map((product) => (
          <ProductCard key={product.id} product={product}/>
        ))}
      </div>
    </div>
  )
}
