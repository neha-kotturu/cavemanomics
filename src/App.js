import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './pages/login'
import Register from './pages/register'
import Main from './pages/main'
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
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
        </div>
      </header>
    </div>
  );
}

export default App;