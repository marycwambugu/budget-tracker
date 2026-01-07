import { useState } from "react";

export default function Transactions({ transactions, setTransactions }) {
  
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("expense");

  return (
    <main className="container">
      <h2 style={{ marginTop: 0 }}>Transactions</h2>

      <form
        style={{ marginBottom: "16px" }}
        onSubmit={(e) => {
          e.preventDefault();

          const newTransaction = {
  amount: Number(amount),
  category,
  date,
  type,
};



          setTransactions([...transactions, newTransaction]);

          setAmount("");
          setCategory("");
          setDate("");
          setType("expense"); // ✅ reset
        }}
      >
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginRight: 8 }}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginRight: 8 }}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginRight: 8 }}
        />

        {/* ✅ NEW: Income / Expense selector */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ marginRight: 8 }}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button type="submit">Add</button>
      </form>

    <ul>
  {transactions.map((t, index) => (
    <li key={index} style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span>
        {t.type === "income" ? "+" : "-"}${t.amount} — {t.category} — {t.date}
      </span>

      <button
        onClick={() => {
          const updated = transactions.filter((_, i) => i !== index);
          setTransactions(updated);
        }}
      >
        Delete
      </button>
    </li>
  ))}
</ul>

    </main>
  );
}
