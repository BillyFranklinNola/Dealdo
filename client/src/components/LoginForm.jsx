import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../slices/authSlice";

const LoginForm = (props) => {
  const { loginEmail, loginPassword } = props;
  const [loginInfo, setLoginInfo] = useState({ email: loginEmail, password: loginPassword });
  const { isLoading, isSuccess, isError, errors } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logChangeHandler = (e) => {
    setLoginInfo((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    const loginData = { email, password };
    try {
      const loginResponse = await dispatch(login(loginData));
      console.log(loginResponse);
    } catch (error) {
      console.log(error);
      toast.error("Login failed");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successful");
      navigate("/products");
      dispatch(reset());
    }
    if (isError) {
      toast.error("Invalid email or password");
      dispatch(reset());
    }
  }, [dispatch, isSuccess, isError, navigate, errors]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="container">
      <div className="mx-auto p-3 border border-2 border-dark rounded">
        <form className="mx-auto" onSubmit={onSubmitHandler}>
          <div className="row form-group align-items-center mt-4">
            <label htmlFor="email" className="col-4 col-lg-3 col-form-label me-2">
              Email:
            </label>
            <div className="col-7 col-lg-8">
              <input
                type="text"
                name="email"
                id="email"
                className="form-control"
                onChange={logChangeHandler}
              />
            </div>
          </div>
          <div className="row form-group align-items-center mt-4 mb-3">
            <label htmlFor="password" className="col-4 col-lg-3 col-form-label me-2">
              Password:
            </label>
            <div className="col-7 col-lg-8">
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                onChange={logChangeHandler}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-warning mt-4 mb-4">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
