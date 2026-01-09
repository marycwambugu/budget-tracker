

import { useEffect, useState } from "react";
import { getTransactions, addTransaction, deleteTransaction } from "../api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "Food",
    date: today,
    type: "expense",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await addTransaction({
        description: form.description,
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        type: form.type,
      });

      const updated = await getTransactions();
      setTransactions(updated);

      setForm({
        description: "",
        amount: "",
        category: "Food",
        date: today,
        type: "expense",
      });
    } catch {
      setError("Failed to add transaction");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    await deleteTransaction(id);
    const updated = await getTransactions();
    setTransactions(updated);
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Transactions</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}
      >
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button type="submit" disabled={saving}>
          {saving ? "Adding..." : "Add"}
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {transactions.map((tx) => (
          <li
            key={tx.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.5rem 0",
              borderBottom: "1px solid #444",
            }}
          >
            <span>
              {tx.type === "expense" ? "-" : "+"}${tx.amount} —{" "}
              {tx.category} — {tx.date}
            </span>
            <button onClick={() => handleDelete(tx.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
