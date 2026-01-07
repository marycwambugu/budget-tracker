export default function Dashboard({ transactions }) {

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const net = income - expenses;

  return (
    <main className="container">
      <p className="subtitle">Quick overview</p>

      <section className="cards">
        <div className="card">
          <p className="cardLabel">Income</p>
          <h2 className="cardValue">${income}</h2>
        </div>

        <div className="card">
          <p className="cardLabel">Expenses</p>
          <h2 className="cardValue">${expenses}</h2>
        </div>

        <div className="card net">
          <p className="cardLabel">Net</p>
          <h2 className="cardValue">${net}</h2>
        </div>
      </section>
    </main>
  );
}
