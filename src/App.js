import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import Login from './pages/login'
import Register from './pages/register'
import ChatSelection from './pages/chatSelection'
import Chat from './pages/chat'
import './App.css';
import Test from './pages/test'
import Main from './pages/main'
import auth, { pullData } from './pages/auth'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatSelection" element={<ChatSelection />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/test" element={<Test />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const ID = pullData(localStorage.getItem('token'));
    setUserID(ID);
  }, []);


  return (
    <div className="App">
      <header className="header">
        <h1 className="title">Cavemanomics</h1>
        <p className="description">
        Trade Smarter, Not Harder
        </p>
        {/* <div className="userId">
        {userID ? (
        <p>Welcome! Your token is: {userID}</p>
      ) : (
        <p>No token found. Please log in.</p>
      )}
        </div> */}
       
        <div className="bttn-container">
          <Link to="/register">
            <button className="bttn">Register</button>
          </Link>
          <Link to="/login">
            <button className="bttn">Login</button>
          </Link>
        </div>
      </header>
    </div>
  );
}

export default App;