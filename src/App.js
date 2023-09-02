import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import Main from './pages/Main';
import RegisterPage from './pages/LoginPage/register';
function App  () {
  console.log("App", sessionStorage.getItem('loginStatus'))
  return(
    
  <Routes>
    <Route path='/login' element={<Login />}/>
    <Route path='/register' element={<RegisterPage />}/>
    <Route path='*' element={<Main />} />
  </Routes>
  )
};
export default App;