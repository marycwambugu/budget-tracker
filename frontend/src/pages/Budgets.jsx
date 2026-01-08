import { useState } from "react";

export default function Budgets() {
  const [month, setMonth] = useState("2026-01");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [budgets, setBudgets] = useState([]);

  function handleAddBudget(e) {
    e.preventDefault();

    if (!category || !amount) return;

    const newBudget = {
      id: Date.now(),
      month,
      category,
      amount: Number(amount),
    };

    setBudgets([...budgets, newBudget]);
    setCategory("");
    setAmount("");
  }

  function handleDeleteBudget(id) {
    setBudgets(budgets.filter((b) => b.id !== id));
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Budgets</h2>

      <form onSubmit={handleAddBudget} style={{ marginBottom: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Food"
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 300"
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit">Add Budget</button>
      </form>

      <h3>Current Budgets</h3>

      {budgets.length === 0 ? (
        <p>No budgets added yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {budgets.map((b) => (
            <li
              key={b.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
                padding: "0.5rem",
                border: "1px solid #ccc",
              }}
            >
              <span>
                {b.category}: ${b.amount}
              </span>

              <button onClick={() => handleDeleteBudget(b.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
