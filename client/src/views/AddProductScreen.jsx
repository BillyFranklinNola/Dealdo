import React from 'react'
import { useSelector } from 'react-redux'
import NavbarTop from '../components/NavbarTop'
import ProductForm from '../components/ProductForm'

export default function AddProductScreen() {
    const loggedInUser = useSelector((state) => state.auth.user);
    const id = loggedInUser.data.user_id;
    console.log(id);

  return (
    <div>
        <NavbarTop />
        <ProductForm 
            initialuserID={id}
            initialName=""
            initialDescription=""
            initialCategory=""
            initialQuantity=""
            initialPrice=""
            initialImg_filenname=""
        />
    </div>
  )
}
