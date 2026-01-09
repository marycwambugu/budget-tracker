const API_URL = import.meta.env.VITE_API_URL;


export async function getTransactions() {
  console.log("FETCHING FROM:", `${API_URL}/transactions`);
  const res = await fetch(`${API_URL}/transactions`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

export async function addTransaction(data) {
  console.log("POSTING TO:", `${API_URL}/transactions`);
  const res = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function deleteTransaction(id) {
  console.log("DELETING:", `${API_URL}/transactions/${id}`);
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete transaction");
  return res.json();
}

export async function getSummary() {
  console.log("FETCHING SUMMARY FROM:", `${API_URL}/transactions/summary`);
  const res = await fetch(`${API_URL}/transactions/summary`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}
