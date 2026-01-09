import { useEffect, useMemo, useState } from "react";
import { getSummary } from "../api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#facc15", "#fb7185", "#06b6d4"];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSummary()
      .then(setSummary)
      .catch(() => setError("Failed to load summary"));
  }, []);

  const pieData = useMemo(() => {
    if (!summary?.spending_by_category) return [];
    return summary.spending_by_category.map((x) => ({
      name: x.category,
      value: x.total,
    }));
  }, [summary]);

  if (error) return <p style={{ color: "tomato" }}>{error}</p>;
  if (!summary) return <p>Loading...</p>;

  return (
    <>
      <h1>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card">
          <strong>Income</strong>
          <p>${summary.total_income}</p>
        </div>
        <div className="card">
          <strong>Expenses</strong>
          <p>${summary.total_expenses}</p>
        </div>
        <div className="card">
          <strong>Net</strong>
          <p>${summary.net}</p>
        </div>
      </div>

      <div className="card">
        <h2>Spending by Category</h2>

        {pieData.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </>
  );
}
