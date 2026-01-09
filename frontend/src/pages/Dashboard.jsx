import { useEffect, useMemo, useState } from "react";
import { getSummary } from "../api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const data = await getSummary();
        setSummary(data);
      } catch (e) {
        setError(e.message || "Failed to load summary");
      }
    }
    load();
  }, []);

  const pieData = useMemo(() => {
    if (!summary?.spending_by_category) return [];
    return summary.spending_by_category.map((x) => ({
      name: x.category,
      value: x.total,
    }));
  }, [summary]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      {error && <p style={{ color: "tomato" }}>{error}</p>}

      {!summary ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
            <div>
              <h3>Income</h3>
              <p>${summary.total_income}</p>
            </div>
            <div>
              <h3>Expenses</h3>
              <p>${summary.total_expenses}</p>
            </div>
            <div>
              <h3>Net</h3>
              <p>${summary.net}</p>
            </div>
          </div>

          <h2>Spending by Category</h2>

          {pieData.length === 0 ? (
            <p>No expenses yet.</p>
          ) : (
            <div style={{ width: 500, height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
