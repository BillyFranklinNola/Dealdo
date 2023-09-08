import React from 'react';
import {Routes, Route, } from 'react-router-dom';
import HomeScreen from './views/HomeScreen';

function App() {
  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            <HomeScreen/>
          }
        />
      </Routes>

    </div>
  );
}

export default App;
