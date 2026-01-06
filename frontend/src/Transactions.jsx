import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

const CATEGORIES = ["Food", "Transport", "Rent", "Shopping", "Bills", "Other"];

function monthFromDate(dateStr) {
  // "2026-01-04" -> "2026-01"
  return dateStr?.slice(0, 7);
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Transactions() {
  const [selectedMonth, setSelectedMonth] = useState(monthFromDate(todayISO()));

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    date: todayISO(),
    note: "",
  });

 const [transactions, setTransactions] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 useEffect(() => {
  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/transactions`);
      if (!res.ok) throw new Error(`GET failed: ${res.status}`);
      const data = await res.json();
      setTransactions(data);
    } catch (e) {
      setError("Backend not running yet (that's okay).");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => monthFromDate(t.date) === selectedMonth)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [transactions, selectedMonth]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

async function addTransaction(e) {
  e.preventDefault();

  const amountNum = Number(form.amount);
  if (!form.date) return alert("Please pick a date.");
  if (!form.category) return alert("Please pick a category.");
  if (!form.amount || Number.isNaN(amountNum) || amountNum <= 0) {
    return alert("Amount must be a number greater than 0.");
  }

  const body = {
    type: form.type,
    amount: amountNum,
    category: form.category,
    date: form.date,
    note: form.note.trim() || null,
  };

  try {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`POST failed: ${res.status}`);
    const saved = await res.json();

    setTransactions((prev) => [saved, ...prev]);
    setForm((prev) => ({ ...prev, amount: "", note: "" }));
    setSelectedMonth(saved.date.slice(0, 7));
  } catch (e) {
    alert("Backend not running yet — can’t save. Ask Person B to start it.");
  }
}

  const amountNum = Number(form.amount);
  if (!form.date) return alert("Please pick a date.");
  if (!form.category) return alert("Please pick a category.");
  if (!form.amount || Number.isNaN(amountNum) || amountNum <= 0) {
    return alert("Amount must be a number greater than 0.");
  }

  const body = {
    type: form.type,
    amount: amountNum,
    category: form.category,
    date: form.date,
    note: form.note.trim() || null,
  };

  try {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`POST failed: ${res.status}`);
    const saved = await res.json();

    setTransactions((prev) => [saved, ...prev]);
    setForm((prev) => ({ ...prev, amount: "", note: "" }));
    setSelectedMonth(saved.date.slice(0, 7));
  } catch (e) {
    alert("Backend not running yet — can’t save. Ask Person B to start it.");
  }
}

    const amountNum = Number(form.amount);
    if (!form.date) return alert("Please pick a date.");
    if (!form.category) return alert("Please pick a category.");
    if (!form.amount || Number.isNaN(amountNum) || amountNum <= 0) {
      return alert("Amount must be a number greater than 0.");
    }

    const newTx = {
      id: crypto.randomUUID(),
      type: form.type,
      amount: amountNum,
      category: form.category,
      date: form.date,
      note: form.note.trim(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // reset only amount + note
    setForm((prev) => ({ ...prev, amount: "", note: "" }));

    // auto-switch month to the transaction's month (nice UX)
    setSelectedMonth(monthFromDate(newTx.date));
  }

  async function deleteTransaction(id) {
  try {
    const res = await fetch(`${API_BASE}/transactions/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  } catch (e) {
    alert("Backend not running yet — can’t delete. Ask Person B to start it.");
  }
}

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of filtered) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, net: income - expense };
  }, [filtered]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 6 }}>Transactions</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>Add income/expenses, filter by month, delete entries.</p>

      {loading && <p style={{ marginTop: 8 }}>Loading…</p>}
      {error && <p style={{ marginTop: 8, color: "crimson" }}>{error}</p>}

      {/* Month selector + totals */}
      

      {/* Month selector + totals */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontWeight: 600 }}>Month</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </label>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <span><b>Income:</b> {totals.income}</span>
          <span><b>Expenses:</b> {totals.expense}</span>
          <span><b>Net:</b> {totals.net}</span>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={addTransaction} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 18 }}>
        <h3 style={{ marginTop: 0 }}>Add transaction</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 10 }}>
          <label style={{ gridColumn: "span 1" }}>
            Type
            <select name="type" value={form.type} onChange={handleChange} style={{ width: "100%" }}>
              <option value="expense">expense</option>
              <option value="income">income</option>
            </select>
          </label>

          <label style={{ gridColumn: "span 1" }}>
            Amount
            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. 120"
              style={{ width: "100%" }}
            />
          </label>

          <label style={{ gridColumn: "span 2" }}>
            Category
            <select name="category" value={form.category} onChange={handleChange} style={{ width: "100%" }}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label style={{ gridColumn: "span 1" }}>
            Date
            <input name="date" type="date" value={form.date} onChange={handleChange} style={{ width: "100%" }} />
          </label>

          <label style={{ gridColumn: "span 1" }}>
            <span style={{ opacity: 0 }}>.</span>
            <button type="submit" style={{ width: "100%", padding: "6px 10px", cursor: "pointer" }}>
              Add
            </button>
          </label>

          <label style={{ gridColumn: "span 6" }}>
            Note (optional)
            <input
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="e.g. groceries at Target"
              style={{ width: "100%" }}
            />
          </label>
        </div>
      </form>

      {/* List */}
      <div style={{ border: "1px solid #ddd", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "120px 100px 1fr 120px 1fr 90px", gap: 8, padding: 10, background: "#f6f6f6", fontWeight: 700 }}>
          <div>Date</div>
          <div>Type</div>
          <div>Category</div>
          <div>Amount</div>
          <div>Note</div>
          <div></div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: 12, opacity: 0.8 }}>No transactions for this month yet.</div>
        ) : (
          filtered.map((t) => (
            <div key={t.id} style={{ display: "grid", gridTemplateColumns: "120px 100px 1fr 120px 1fr 90px", gap: 8, padding: 10, borderTop: "1px solid #eee", alignItems: "center" }}>
              <div>{t.date}</div>
              <div>{t.type}</div>
              <div>{t.category}</div>
              <div>{t.amount}</div>
              <div>{t.note || "-"}</div>
              <button onClick={() => deleteTransaction(t.id)} style={{ cursor: "pointer" }}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}