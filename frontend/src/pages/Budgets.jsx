import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Budgets() {
  const [month, setMonth] = useState("2026-01");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/budgets/?month=${month}`)
      .then((res) => res.json())
      .then(setBudgets)
      .catch((err) => console.error(err));
  }, [month]);

  async function handleAddBudget(e) {
    e.preventDefault();
    if (!category || !amount) return;

    const res = await fetch(`${API_URL}/budgets/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month,
        category,
        amount: Number(amount),
      }),
    });

    const newBudget = await res.json();
    setBudgets([...budgets, newBudget]);
    setCategory("");
    setAmount("");
  }

  async function handleDeleteBudget(id) {
    await fetch(`${API_URL}/budgets/${id}`, { method: "DELETE" });
    setBudgets(budgets.filter((b) => b.id !== id));
  }

  return (
    <div className="card" style={{ maxWidth: 600 }}>
      <h2>Budgets</h2>

      <form onSubmit={handleAddBudget}>
        <label>Month</label>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />

        <label>Category</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} />

        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button type="submit">Add Budget</button>
      </form>

      {budgets.length === 0 ? (
        <p>No budgets yet</p>
      ) : (
        <ul>
          {budgets.map((b) => (
            <li key={b.id} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{b.category}: ${b.amount}</span>
              <button onClick={() => handleDeleteBudget(b.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
