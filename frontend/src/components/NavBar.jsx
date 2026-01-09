import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("user");
    window.location.reload();
  }

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#4f46e5" : "#eaeaea",
    textDecoration: "none",
    fontWeight: 500,
  });

  return (
    <nav
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        padding: "16px 24px",
        background: "#181b22",
        borderRadius: "12px",
        marginBottom: "32px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
      }}
    >
      <Link to="/" style={linkStyle("/")}>
        Dashboard
      </Link>

      <Link to="/transactions" style={linkStyle("/transactions")}>
        Transactions
      </Link>

      <Link to="/budgets" style={linkStyle("/budgets")}>
        Budgets
      </Link>

      <button
        onClick={handleLogout}
        style={{
          marginLeft: "auto",
          background: "transparent",
          color: "#eaeaea",
          border: "1px solid #2d2f36",
          padding: "8px 14px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 500,
        }}
        onMouseOver={(e) => (e.target.style.background = "#2d2f36")}
        onMouseOut={(e) => (e.target.style.background = "transparent")}
      >
        Logout
      </button>
    </nav>
  );
}
