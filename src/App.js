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
import Upload from './pages/upload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatSelection" element={<ChatSelection />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/main" element={<Main />} />
        <Route path="/upload" element={<Upload />} />
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
      <div className="decor-circle circle-1"></div>
      <div className="decor-circle circle-2"></div>
      
      <header className="header">
        <h1 className="title">Cavemanomics</h1>
        <p className="description">
          Trade Smarter, Not Harder
        </p>
       
        <div className="features-section">
          <div className="feature">
            <span className="feature-icon">💼</span>
            <span className="feature-text">Barter Items</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔄</span>
            <span className="feature-text">Instant Swaps</span>
          </div>
          <div className="feature">
            <span className="feature-icon">💬</span>
            <span className="feature-text">Chat Support</span>
          </div>
        </div>
        
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