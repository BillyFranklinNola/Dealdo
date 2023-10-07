import React from "react";
import LoginForm from "../components/LoginForm";

const LoginScreen = () => {
  return (
    <div className="container-fluid col-11 pt-5">
      <div className="col-lg-6 mb-3 mb-lg-0 mx-auto">
        <h3 className="my-4 ms-2">Login:</h3>
        <div className="mt-3">
          <LoginForm loginEmail="" loginPassword="" />
        </div>
        <div className="d-flex m-3">
          <p className="me-3">Not a member?</p>
          <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
