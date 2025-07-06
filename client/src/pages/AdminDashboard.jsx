import { useState } from "react";

export default function AdminDashboard() {
  const [msg, setMsg] = useState("");

  const triggerAggregation = async () => {
    setMsg("⏳ Running aggregation...");

    try {
      const res = await fetch("/api/admin/aggregate-summary", {
        method: "POST"
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("✅ " + data.message);
      } else {
        throw new Error(data.error || "Failed to run aggregation");
      }
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <button className="btn btn-primary mt-3" onClick={triggerAggregation}>
        Run Daily Summary Aggregation
      </button>
      {msg && <div className="mt-3 alert alert-info">{msg}</div>}
    </div>
  );
}
