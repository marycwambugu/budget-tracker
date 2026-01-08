import { Link } from "react-router-dom";

export default function NavBar() {
  function handleLogout() {
    localStorage.removeItem("user");
    window.location.reload(); // simplest + reliable
  }

  return (
    <nav
      style={{
        display: "flex",
        gap: "2rem",
        padding: "1rem",
        backgroundColor: "#111",
        alignItems: "center",
      }}
    >
      <Link style={{ color: "white" }} to="/">
        Dashboard
      </Link>

      <Link style={{ color: "white" }} to="/transactions">
        Transactions
      </Link>

      <Link style={{ color: "white" }} to="/budgets">
        Budgets
      </Link>

      <button
        onClick={handleLogout}
        style={{
          marginLeft: "auto",
          background: "transparent",
          color: "white",
          border: "1px solid white",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </nav>
  );
}
