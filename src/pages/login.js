import React from "react";
import '../css/login.css'


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

  export default Login;