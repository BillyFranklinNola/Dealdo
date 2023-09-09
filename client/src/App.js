import React from 'react';
import { Routes, Route, } from 'react-router-dom';
import HomeScreen from './views/HomeScreen';
import RegisterScreen from './views/RegisterScreen';
import LoginScreen from './views/LoginScreen';
import { ToastContainer } from 'react-toastify';


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
      </Routes>
      <ToastContainer/>
    </div>
  );
}

export default App;
