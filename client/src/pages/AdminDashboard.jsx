// import { useEffect, useState } from "react";
// import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from "recharts";

// export default function AdminDashboard() {
//   const [data, setData] = useState([]);
//   const [msg, setMsg] = useState("");

//   const fetchSummary = async () => {
//     try {
//       const res = await fetch("/api/admin/daily-summary", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         }
//       });
//       const result = await res.json();
//       console.log("📊 Fetched Summary:", result);
//       setData(result);

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchSummary();
//   }, []);

//   const runAggregation = async () => {
//     try {
//       const res = await fetch("/api/admin/aggregate-summary", {
//         method: "POST",
//       });
//       const result = await res.json();

//       if (res.ok) {
//         setMsg("✅ Aggregation successful!");
//         fetchSummary(); // refresh data
//       } else {
//         setMsg(`❌ ${result.error || "Aggregation failed"}`);
//       }
//     } catch (err) {
//       setMsg("❌ Error calling backend");
//       console.error(err);
//     }

//     setTimeout(() => setMsg(""), 3000);
//   };

//   // Group data by product name
//   const grouped = {};
//   data.forEach((d) => {
//     const name = d.productId.name;
//     if (!grouped[name]) grouped[name] = [];
//     grouped[name].push({
//       date: d.date,
//       views: d.views,
//       carts: d.carts,
//       wishlists: d.wishlists,
//     });
//     console.log("🔁 Summary Row:", d);
//   });

//   return (
//     <div className="container">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2>📊 Admin Dashboard</h2>
//         <button className="btn btn-primary" onClick={runAggregation}>
//           Run Daily Aggregation
//         </button>
//       </div>

//       {msg && <div className="alert alert-info">{msg}</div>}

//       {Object.entries(grouped).map(([product, trend], i) => (
//         <div key={i} className="mb-5">
//           <h4>{product}</h4>

//           <LineChart width={600} height={250} data={trend}>
//             <Line type="monotone" dataKey="views" stroke="#8884d8" />
//             <Line type="monotone" dataKey="carts" stroke="#82ca9d" />
//             <Line type="monotone" dataKey="wishlists" stroke="#ff7300" />
//             <CartesianGrid stroke="#ccc" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//           </LineChart>

//           <BarChart width={600} height={200} data={trend}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="views" fill="#8884d8" />
//             <Bar dataKey="carts" fill="#82ca9d" />
//             <Bar dataKey="wishlists" fill="#ff7300" />
//           </BarChart>
//         </div>
//       ))}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, Legend
} from "recharts";

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");
  const [aiInsights, setAiInsights] = useState({});

  const fetchSummary = async () => {
    try {
      const res = await fetch("/api/admin/daily-summary", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      const result = await res.json();
      // console.log("📊 Fetched Summary:", result);
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const runAggregation = async () => {
    try {
      const res = await fetch("/api/admin/aggregate-summary", {
        method: "POST",
      });
      const result = await res.json();

      if (res.ok) {
        setMsg("✅ Aggregation successful!");
        fetchSummary(); // refresh data
      } else {
        setMsg(`❌ ${result.error || "Aggregation failed"}`);
      }
    } catch (err) {
      setMsg("❌ Error calling backend");
      console.error(err);
    }

    setTimeout(() => setMsg(""), 3000);
  };



  const grouped = {};
  data.forEach((d) => {
    const name = d.productId.name;
    if (!grouped[name]) grouped[name] = [];
    grouped[name].push({
      date: d.date,
      views: d.views,
      carts: d.carts,
      purchases: d.purchases,
      wishlists: d.wishlists,
      productId: d.productId._id,
      cost: d.cost
    });
    // console.log("🔁 Summary Row:", d);
  });

  // console.log(grouped)
  const fetchInsight = async (productName, latest) => {
    try {
      const res = await fetch("/api/ai/predict-insight", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...latest, productName })
      });
      const result = await res.json();
      console.log("📡 AI Insight:", result);

      setAiInsights(prev => ({
        ...prev,
        [productName]: result
      }));
    } catch (err) {
      console.error("❌ Error fetching AI insight:", err);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📊 Admin Dashboard</h2>
        <button className="btn btn-primary" onClick={runAggregation}>
          Run Daily Aggregation
        </button>
      </div>

      {msg && <div className="alert alert-info">{msg}</div>}

      {Object.entries(grouped).map(([product, trend], i) => {
        const latest = trend[trend.length - 1];
        // console.log(product, trend);
        return (
          <div key={i} className="mb-5">
            <div className="d-flex align-items-center gap-3">
              <h4>{product}</h4>
              <h5>cost: {latest.cost}</h5>
            </div>
            <div className="d-flex">

              <LineChart width={600} height={250} data={trend}>
                <Line type="monotone" dataKey="views" stroke="#8884d8" />
                <Line type="monotone" dataKey="carts" stroke="#82ca9d" />
                <Line type="monotone" dataKey="wishlists" stroke="#ff7300" />
                <Line type="monotone" dataKey="purchases" stroke="#ff0000" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
              </LineChart>

              <BarChart width={600} height={200} data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" />
                <Bar dataKey="carts" fill="#82ca9d" />
                <Bar dataKey="wishlists" fill="#ff7300" />
                <Bar dataKey="purchases" fill="#ff0000" />
              </BarChart>
            </div>

            <button
              className="btn btn-outline-info mt-3"
              onClick={() => fetchInsight(product, latest)}
            >
              🔍 Get AI Insight
            </button>

            {aiInsights[product] && (
              <div className="card mt-3 border-info shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">🧠 AI Insights</h5>
                  <p><strong>Trend:</strong> {aiInsights[product].predictedTrend}</p>
                  <p><strong>Spike Detected:</strong> {aiInsights[product].spikeDetected ? "Yes" : "No"}</p>
                  <p><strong>Spike Magnitude:</strong> {aiInsights[product].spikeMagnitude}</p>
                  <p><strong>Suggested Actions:</strong></p>
                  <ul>
                    {aiInsights[product].actions?.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
