import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";

function App() {
  const [transactions, setTransactions] = useState(() => {
  const saved = localStorage.getItem("transactions");
  return saved ? JSON.parse(saved) : [];
});
useEffect(() => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}, [transactions]);


  return (
    <div className="app">
      {/* TOP BAR */}
      <header className="topbar">
        <div className="topbarInner">
          <h1 className="logo">Budget Tracker</h1>

          <nav className="nav">
            <NavLink to="/" end className="navLink">
              Dashboard
            </NavLink>

            <NavLink to="/transactions" className="navLink">
              Transactions
            </NavLink>

            <NavLink to="/budgets" className="navLink">
              Budgets
            </NavLink>
          </nav>
        </div>
      </header>

      {/* ROUTES */}
      <Routes>
        <Route
          path="/"
          element={<Dashboard transactions={transactions} />}
        />

        <Route
          path="/transactions"
          element={
            <Transactions
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        />

        <Route path="/budgets" element={<Budgets />} />
      </Routes>
    </div>
  );
}

export default App;
