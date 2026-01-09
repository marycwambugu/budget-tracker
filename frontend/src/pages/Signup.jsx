import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSignup(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const existingUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    const userExists = existingUsers.find(
      (u) => u.email === email
    );

    if (userExists) {
      alert("User already exists. Please login.");
      return;
    }

    const newUser = { email, password };
    existingUsers.push(newUser);

    localStorage.setItem(
      "users",
      JSON.stringify(existingUsers)
    );

    alert("Signup successful! Please login.");
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 400, margin: "4rem auto" }}>
      <h2>Sign Up</h2>

      <form onSubmit={handleSignup}>
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
          Sign Up
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
