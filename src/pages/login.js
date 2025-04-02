import React from "react";
import '../css/login.css'


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

      if (!response.ok) {
        throw new Error("Error registering user");
      }

      const data = await response.json();
      console.log("User successfully logged in:", data);
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="App">
      <a href='/' className="app-title">Cavemanomics</a>
      <header className="header">
        <h1>Login</h1>
        <form className="input-container" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            className="input-field" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bttn" type="submit">Login</button>
        </form>
      </header>
    </div>
  );
}

export default Login;