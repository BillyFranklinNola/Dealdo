import React from 'react';
import { Routes, Route, } from 'react-router-dom';
import HomeScreen from './views/HomeScreen';
import RegisterScreen from './views/RegisterScreen';
import LoginScreen from './views/LoginScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddProductScreen from './views/AddProductScreen';



function App() {
  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            <LoginScreen/>
          }
        />
        <Route
          path='/register'
          element={
            <RegisterScreen/>
          }
        />
        <Route
          path='/products'
          element={
            <HomeScreen/>
          }
        />
        <Route
          path='/products/add'
          element={
            <AddProductScreen/>
          }
        />
      </Routes>

      <ToastContainer/>
    </div>
  );
}

export default App;
