import { useEffect, useState } from "react";
import { getTransactions, addTransaction, deleteTransaction } from "../api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: today,
    type: "expense",
  });

  useEffect(() => {
    async function load() {
      try {
        setTransactions(await getTransactions());
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
    setForm((f) => ({ ...f, [name]: value }));
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

      setTransactions(await getTransactions());

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
    try {
      await deleteTransaction(id);
      setTransactions(await getTransactions());
    } catch {
      setError("Failed to delete transaction");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 800 }}>
      <h2>Transactions</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="date" type="date" value={form.date} onChange={handleChange} />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button type="submit" disabled={saving}>
          {saving ? "Adding..." : "Add Transaction"}
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "tomato" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {transactions.map((tx) => (
          <li key={tx.id} style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              {tx.type === "expense" ? "-" : "+"}${tx.amount} — {tx.category} — {tx.date}
            </span>
            <button onClick={() => handleDelete(tx.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
