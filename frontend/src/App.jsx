import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";

export default function App() {
  const [transactions, setTransactions] = useState([]);

  return (
    <BrowserRouter>
      <NavBar />

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
    </BrowserRouter>
  );
}
