import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../slices/authSlice";

const UserForm = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    initialFirstName,
    initialLastName,
    initialEmail,
    initialInstrument,
    initialPassword,
    initialConfirmPassword,
  } = props;

  const [formState, setFormState] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    email: initialEmail,
    instrument: initialInstrument,
    password: initialPassword,
    confirmPassword: initialConfirmPassword,
    isSubmitted: false,
  });

  const { firstName, lastName, email, instrument, password, confirmPassword } =
    formState;

  const { isLoading, isSuccess } = useSelector((state) => state.auth);

  const changeHandler = (e) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const musicianData = {
      firstName,
      lastName,
      email,
      instrument,
      password,
      confirmPassword,
    };
    const response = await dispatch(register(musicianData));
    if (isSuccess) {
      console.log(response.payload);
      setFormState((prevState) => ({
        ...prevState,
        isSubmitted: true,
      }));
      navigate("/");
    } else {
      const errorResponse = response.payload;
      console.log(errorResponse);
      for (const key of Object.keys(errorResponse)) {
        toast.error(errorResponse[key].message);
      }
    }
  };
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="container-fluid">
      <div className="panelBackground text-secondary mx-auto p-3 border border-2 border-dark rounded">
        <form className="mx-auto" onSubmit={onSubmitHandler}>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="firstName"
              className="col-4 col-lg-3 col-form-label me-2"
            >
              First Name:
            </label>
            <div className="col-7 col-lg-8">
              <input
                type="text"
                name="firstName"
                id="firstName"
                className="form-control"
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="lastName"
              className="col-4 col-lg-3 col-form-label me-2"
            >
              Last Name:
            </label>
            <div className="col-7 col-lg-8">
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="form-control"
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="email"
              className="col-4 col-lg-3 col-form-label me-2"
            >
              Email:
            </label>
            <div className="col-7 col-lg-8">
              <input
                type="text"
                name="email"
                id="email"
                className="form-control"
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="streetAddress"
              className="col-3 col-lg-2 col-form-label me-2"
            >
              Address:
            </label>
            <div className="col-8 col-lg-9">
              <input
                type="text"
                name="streetAddress"
                id="streetAddress"
                className="form-control"
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="city"
              className="col-3 col-lg-2 col-form-label me-2"
            >
              City:
            </label>
            <div className="col-8 col-lg-9">
              <input
                type="text"
                name="city"
                id="city"
                className="form-control"
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="state"
              className="col-3 col-lg-2 col-form-label me-2"
            >
              State:
            </label>
            <div className="col-8 col-lg-9">
              <select
                name="state"
                id="state"
                className="form-control"
                onChange={changeHandler}
              >
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="DC">District Of Columbia</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>
            </div>
          </div>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="zipCode"
              className="col-3 col-lg-2 col-form-label me-2"
            >
              Zip:
            </label>
            <div className="col-8 col-lg-9">
              <input
                type="text"
                name="zipCode"
                id="zipCode"
                className="form-control"
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="password"
              className="col-4 col-lg-3 col-form-label me-2"
            >
              Password:
            </label>
            <div className="col-7 col-lg-8">
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                onChange={changeHandler}
              />
            </div>
          </div>
          {/* <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="confirmPassword"
              className="col-4 col-lg-3 col-form-label me-2"
            >
              Confirm Password:
            </label>
            <div className="col-7 col-lg-8">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="form-control"
                onChange={changeHandler}
              />
            </div>
          </div> */}
          <button input type="submit" className="btn btn-warning mt-4 mb-3">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
