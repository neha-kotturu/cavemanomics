import React, { useState } from "react";
import '../css/login.css'
import { useNavigate } from "react-router-dom";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Trying submit");

    // Create the user data object
    const userData = { username, password };

    try {
      // Send POST request to express
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      console.log("response:", response)

      if (!response.ok) {
        throw new Error(response);
      }

      const data = await response.json();

      localStorage.setItem('token', JSON.stringify(data));
      console.log("User successfully logged in");
      setTimeout(() => {
        navigate("/main");
      }, 1000);

    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="App">
      <div className="decor-circle circle-1"></div>
      <div className="decor-circle circle-2"></div>
      
      <a href='/' className="app-title">Cavemanomics</a>
      <header className="header">
        <h1 className="title">Welcome Back</h1>
        <p className="description">Login to your account</p>
        
        <form className="input-container" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            className="input-field" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="bttn" type="submit">Sign In</button>
          
          <div className="alt-action">
            Don't have an account? <a href="/register">Register</a>
          </div>
        </form>
      </header>
    </div>
  );
}

export default Login;