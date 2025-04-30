import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './pages/login'
import Register from './pages/register'
import ChatSelection from './pages/chatSelection'
import Chat from './pages/chat'
import './App.css';
import { useState } from 'react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatSelection" element={<ChatSelection />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div className="App">
      <header className="header">
        <h1 className="title">Cavemanomics</h1>
        <p className="description">
        Trade Smarter, Not Harder
        </p>
       
        <div className="bttn-container">
          <Link to="/register">
            <button className="bttn">Register</button>
          </Link>
          <Link to="/login">
            <button className="bttn">Login</button>
          </Link>
          <Link to="/chatSelection">
             <button className="bttn">Test Chat</button>
          </Link>
        </div>
      </header>
    </div>
  );
}

export default App;