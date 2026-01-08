import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

const CATEGORIES = ["Food", "Transport", "Rent", "Shopping", "Bills", "Other"];

function monthFromDate(dateStr) {
  return dateStr?.slice(0, 7);
}

function currentMonth() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}

export default function Budgets() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]); // { id, month, category, limit }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // fetch BOTH transactions + budgets
  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [txRes, bRes] = await Promise.all([
        fetch(`${API_BASE}/transactions`),
        fetch(`${API_BASE}/budgets`),
      ]);

      if (!txRes.ok) throw new Error(`GET /transactions failed: ${txRes.status}`);
      if (!bRes.ok) throw new Error(`GET /budgets failed: ${bRes.status}`);

      const txData = await txRes.json();
      const bData = await bRes.json();

      setTransactions(Array.isArray(txData) ? txData : []);
      setBudgets(Array.isArray(bData) ? bData : []);
    } catch (e) {
      setError("Backend not running yet (that's okay).");
      setTransactions([]);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Spend per category for selected month
  const spendByCategory = useMemo(() => {
    const out = {};
    for (const c of CATEGORIES) out[c] = 0;

    const monthTx = transactions.filter((t) => monthFromDate(t.date) === selectedMonth);
    for (const t of monthTx) {
      if (t.type === "expense") {
        out[t.category] = (out[t.category] || 0) + Number(t.amount || 0);
      }
    }
    return out;
  }, [transactions, selectedMonth]);

  // Budget limits for selected month (map category -> limit)
  const limitByCategory = useMemo(() => {
    const map = {};
    for (const c of CATEGORIES) map[c] = 0;

    for (const b of budgets) {
      if (b.month === selectedMonth) {
        map[b.category] = Number(b.limit || 0);
      }
    }
    return map;
  }, [budgets, selectedMonth]);

  // rows with derived values
  const rows = useMemo(() => {
    return CATEGORIES.map((category) => {
      const spent = spendByCategory[category] || 0;
      const limit = limitByCategory[category] || 0;
      const remaining = limit - spent;
      const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;

      // find budget id (if exists) so delete/update works
      const existing = budgets.find((b) => b.month === selectedMonth && b.category === category);

      return {
        category,
        spent,
        limit,
        remaining,
        pct,
        budgetId: existing?.id || null,
      };
    });
  }, [budgets, limitByCategory, selectedMonth, spendByCategory]);

  // Create/Update a budget for (month, category)
  async function upsertBudget(category, limitValue) {
    const limitNum = Number(limitValue);
    if (Number.isNaN(limitNum) || limitNum < 0) {
      return alert("Limit must be a number (0 or more).");
    }

    const existing = budgets.find((b) => b.month === selectedMonth && b.category === category);

    const body = {
      month: selectedMonth,
      category,
      limit: limitNum,
    };

    try {
      let res;
      if (existing) {
        // PUT /budgets/{id}
        res = await fetch(`${API_BASE}/budgets/${existing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`PUT failed: ${res.status}`);
        const updated = await res.json();
        setBudgets((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      } else {
        // POST /budgets
        res = await fetch(`${API_BASE}/budgets`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`POST failed: ${res.status}`);
        const created = await res.json();
        setBudgets((prev) => [created, ...prev]);
      }
    } catch (e) {
      alert("Backend not running yet — can’t save budgets. Ask Person B to start it.");
    }
  }

  async function deleteBudget(budgetId) {
    if (!budgetId) return;
    try {
      const res = await fetch(`${API_BASE}/budgets/${budgetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
      setBudgets((prev) => prev.filter((b) => b.id !== budgetId));
    } catch (e) {
      alert("Backend not running yet — can’t delete budgets. Ask Person B to start it.");
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 6 }}>Budgets</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Set monthly limits per category and compare against spending.
      </p>

      {loading && <p style={{ marginTop: 8 }}>Loading…</p>}
      {error && <p style={{ marginTop: 8, color: "crimson" }}>{error}</p>}

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontWeight: 600 }}>Month</span>
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
        </label>

        <button onClick={loadAll} style={{ padding: "6px 10px", cursor: "pointer" }}>
          Refresh
        </button>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 10, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "160px 120px 120px 120px 1fr 90px",
            gap: 8,
            padding: 10,
            background: "#f6f6f6",
            fontWeight: 700,
          }}
        >
          <div>Category</div>
          <div>Limit</div>
          <div>Spent</div>
          <div>Remaining</div>
          <div>Usage</div>
          <div></div>
        </div>

        {rows.map((r) => (
          <div
            key={r.category}
            style={{
              display: "grid",
              gridTemplateColumns: "160px 120px 120px 120px 1fr 90px",
              gap: 8,
              padding: 10,
              borderTop: "1px solid #eee",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 600 }}>{r.category}</div>

            <div>
              <input
                defaultValue={r.limit}
                onBlur={(e) => upsertBudget(r.category, e.target.value)}
                style={{ width: "100%" }}
                placeholder="0"
              />
            </div>

            <div>{r.spent}</div>
            <div>{r.remaining}</div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 10, borderRadius: 999, background: "#ddd", overflow: "hidden" }}>
                <div style={{ width: `${r.pct}%`, height: "100%", background: r.pct >= 100 ? "crimson" : "#333" }} />
              </div>
              <div style={{ width: 44, textAlign: "right" }}>{r.limit > 0 ? `${r.pct}%` : "-"}</div>
            </div>

            <div>
              <button
                disabled={!r.budgetId}
                onClick={() => deleteBudget(r.budgetId)}
                style={{ cursor: r.budgetId ? "pointer" : "not-allowed", opacity: r.budgetId ? 1 : 0.5 }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 12, opacity: 0.7, fontSize: 13 }}>
        Tip: click into a Limit field, type a number, then click away — it saves on blur.
      </p>
    </div>
  );
}