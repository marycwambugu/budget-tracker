import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: "2rem",
        padding: "1rem",
        backgroundColor: "#111",
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
    </nav>
  );
}
