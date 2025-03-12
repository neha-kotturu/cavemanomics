import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
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

function Register() {
  return (
    <div className="App">
      <a href='/' className="app-title">Cavemanomics</a>
      <header className="header">
        <h1>Register</h1>
        <form className="input-container">
          <input type="text" placeholder="Username" className="input-field"/>
          <input type="email" placeholder="Email" className="input-field"/>
          <input type="password" placeholder="Password" className="input-field"/>
          <button className="bttn">Register</button>
        </form>
      </header>
    </div>
  );
}

function Login() {
  return (
    <div className="App">
      <a href='/' className="app-title">Cavemanomics</a>
      <header className="header">
        <h1>Login</h1>
        <form className="input-container">
          <input type="email" placeholder="Email" className="input-field"/>
          <input type="password" placeholder="Password" className="input-field"/>
          <button className="bttn">Login</button>
        </form>
      </header>
    </div>
  );
}

export default App;