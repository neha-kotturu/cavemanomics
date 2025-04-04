import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import { useState } from 'react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
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
          <Link to="/chat">
             <button className="bttn">Test Chat</button>
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

function Chat() {
  const [texts, setTexts] = useState(["test1", "test2", "test3"]);
  var i = 0;
  var textObjects = texts.map(s => {i++; return <p key={i}>{s}</p>;});

  function submitText() {
    const newTexts = texts.slice();
    const text = document.getElementById("textInput");
    newTexts.push(text.value);
    setTexts(newTexts);
  }

  return (
    <div className="App">
      <a href='/' className="app-title">Cavemanomics</a>
      <header className="header">
        <h1>Chat</h1>
        <div className="chatbox">
          {textObjects}
        </div>
        <input id="textInput" type="text" placeholder="Message" className="input-field"/>
        <button className="bttn" onClick={submitText}>Send</button>
      </header>
    </div>
  );
}

export default App;