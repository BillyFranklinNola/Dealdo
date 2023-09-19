import React, { useState } from "react";
import { useSelector } from "react-redux";
import "react-responsive-modal/styles.css";

const ProductForm = ({ onSubmit, onImageChange, isEditing, ...props }) => {
  const loggedInUser = useSelector((state) => state.auth.user);
  const token = loggedInUser.token;
  console.log(token);

  const {
    initialuserID,
    initialName,
    initialDescription,
    initialCategory,
    initialQuantity,
    initialPrice,
    initialProductID
  } = props;

  const [product, setProduct] = useState({
    userID: initialuserID,
    name: initialName,
    description: initialDescription,
    category: initialCategory,
    quantity: initialQuantity,
    price: initialPrice,
    image: null,
    product_id: initialProductID ? initialProductID : null,
  });

  console.log(product);

  const changeHandler = (e) => {
    try {
      if (e.target.name === "image") {
        const file = e.target.files[0];
        setProduct({
          ...product,
          image: file,
        });
      } else {
        setProduct({
          ...product,
          [e.target.name]: e.target.value,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(product);
    onSubmit(product);
  };

  return (
      <div className="container-fluid">
        <div className="panelBackground text-secondary mx-auto p-3 border border-2 border-dark rounded">
          <form className="mx-auto" onSubmit={onSubmitHandler}>
            <div className="row form-group align-items-center mt-4">
              <label
                htmlFor="name"
                className="col-4 col-lg-3 col-form-label me-2"
              >
                Title:
              </label>
              <div className="col-7 col-lg-8">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={product.name? product.name : null}
                  className="form-control"
                  onChange={changeHandler}
                />
              </div>
            </div>
            <div className="row form-group align-items-center mt-4">
              <label
                htmlFor="description"
                className="col-4 col-lg-3 col-form-label me-2"
              >
                Description:
              </label>
              <div className="col-7 col-lg-8">
                <input
                  type="text"
                  name="description"
                  id="description"
                  value={product.description ? product.description : null}
                  className="form-control"
                  onChange={changeHandler}
                />
              </div>
            </div>
            <div className="row form-group align-items-center mt-4">
              <label
                htmlFor="category"
                className="col-3 col-lg-2 col-form-label me-2"
              >
                Category:
              </label>
              <div className="col-8 col-lg-9">
                <select
                  name="category"
                  id="category"
                  value={product.category? product.category : null}
                  className="form-control"
                  onChange={changeHandler}
                >
                  <option value="" disabled selected>Select a category</option>
                  <option value="home_and_garden">Home and Garden</option>
                  <option value="electronics">Electronics</option>
                  <option value="health_and_wellness">Health and Wellness</option>
                  <option value="automotive">Automotive</option>
                  <option value="pet_care">Pet Care</option>
                  <option value="clothing_and_apparel">Clothing and Apparel</option>
                  <option value="musical_equipment">Musical Equipment</option>
                  <option value="arts_and_crafts">Arts and Crafts</option>
                  <option value="toys_and_games">Toys and Games</option>
                </select>
              </div>
            </div>
            <div className="row form-group align-items-center mt-4">
              <label
                htmlFor="quantity"
                className="col-4 col-lg-3 col-form-label me-2"
              >
                Quantity:
              </label>
              <div className="col-7 col-lg-8">
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  value={product.quantity? product.quantity : null}
                  className="form-control"
                  onChange={changeHandler}
                />
              </div>
            </div>
            <div className="row form-group align-items-center mt-4">
              <label
                htmlFor="price"
                className="col-4 col-lg-3 col-form-label me-2"
              >
                Price:
              </label>
              <div className="col-7 col-lg-8">
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={product.price? product.price : null}
                  pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                  className="form-control"
                  onChange={changeHandler}
                />
              </div>
            </div>
            { !isEditing ?
            <div className="row form-group align-items-center mt-4">
              <label
                htmlFor="image"
                className="col-4 col-lg-3 col-form-label me-2"
              >
                Image:
              </label>
              <div className="col-7 col-lg-8">
                <input
                  type="file"
                  accept=".pdf, .png, .jpg, .jpeg, .gif"
                  name="image"
                  id="image"
                  className="form-control"
                  onChange={changeHandler}
                />
              </div>
            </div>
            : null
            }
            <button input type="submit" className="btn btn-warning mt-4 mb-3">
              Submit
            </button>
          </form>
        </div>
      </div>
  );
};

export default ProductForm;
