import React from 'react';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Pages/Dashboard';
import Transfer from './Pages/Transfer';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import { RecoilRoot } from 'recoil';
function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/transfer" element={<Transfer />} />
            </>
          ) : (
            <>
              <Route path="/" element={<SignIn />} />
              <Route path="/transfer" element={<SignIn />} />
            </>
          )}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
