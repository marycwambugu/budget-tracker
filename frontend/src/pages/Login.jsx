import { useState } from "react";
import { Link } from "react-router-dom";


export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const user = { email };

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user); // 🔑 THIS triggers App rerender
  }

  return (
    <div style={{ maxWidth: 400, margin: "4rem auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>
  Don’t have an account? <Link to="/signup">Sign up</Link>
</p>


    </div>
  );
}
