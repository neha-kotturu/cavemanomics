import React, { useState } from "react";
import '../css/register.css';
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Trying submit");

    // Create the user data object
    const userData = { username, email, password };

    try {
      // Send POST request to your backend API
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error("Error registering user");
      }

      const data = await response.json();
      console.log("User registered successfully:", data);
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      console.error("Error adding user:", error);
      // Optionally, display an error message to the user here
    }
  };

  return (
    <div className="App">
      <div className="decor-circle circle-1"></div>
      <div className="decor-circle circle-2"></div>
      
      <a href='/' className="app-title">Cavemanomics</a>
      <header className="header">
        <h1 className="title">Join Cavemanomics</h1>
        <p className="description">Create your account</p>
        
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
            type="email" 
            placeholder="Email" 
            className="input-field" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button className="bttn" type="submit">Create Account</button>
          
          <div className="alt-action">
            Already have an account? <a href="/login">Sign In</a>
          </div>
        </form>
      </header>
    </div>
  );
}

export default Register;
