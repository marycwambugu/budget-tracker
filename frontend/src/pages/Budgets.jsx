import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000";

export default function Budgets() {
  const [month, setMonth] = useState("2026-01");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [budgets, setBudgets] = useState([]);

  // Fetch budgets when month changes
  useEffect(() => {
    fetch(`${API_URL}/budgets/?month=${month}`)
      .then((res) => res.json())
      .then((data) => setBudgets(data))
      .catch((err) => console.error("Error fetching budgets:", err));
  }, [month]);

  // Add budget
  async function handleAddBudget(e) {
    e.preventDefault();
    if (!category || !amount) return;

    const response = await fetch(`${API_URL}/budgets/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month,
        category,
        amount: Number(amount),
      }),
    });

    const newBudget = await response.json();
    setBudgets([...budgets, newBudget]);

    setCategory("");
    setAmount("");
  }

  // Delete budget (REAL delete)
  async function handleDeleteBudget(id) {
    await fetch(`${API_URL}/budgets/${id}`, {
      method: "DELETE",
    });

    // Re-fetch budgets after delete
    const res = await fetch(`${API_URL}/budgets/?month=${month}`);
    const data = await res.json();
    setBudgets(data);
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Budgets</h2>

      <form onSubmit={handleAddBudget}>
        <label>Month</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />

        <label>Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

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
            <li key={b.id}>
              {b.category}: ${b.amount}
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
