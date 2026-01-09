import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Signup from "./pages/Signup";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";



export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <BrowserRouter>
      {user && <NavBar setUser={setUser} />}

      <Routes>
        {!user ? (
  <>
    <Route path="/login" element={<Login setUser={setUser} />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="*" element={<Navigate to="/login" />} />
  </>
) : (


          <>
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
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
