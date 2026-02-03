import { useEffect, useState } from "react";
import axios from "axios";
import AddTransactionModal from "../components/AddTransactionModal";
import Transfer from "../components/Transfer";

const API = "https://money-manager-backend-33qh.onrender.com";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [period, setPeriod] = useState("all");
  const [division, setDivision] = useState("all");
  const [category, setCategory] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const load = async () => {
    const res = await axios.get(`${API}/transactions`);
    setTransactions(res.data);
  };

  useEffect(() => { load(); }, []);

  const filtered = transactions.filter(t => {
    const d = new Date(t.createdAt);
    const now = new Date();

    if (period === "week" && (now - d) / 86400000 > 7) return false;
    if (period === "month" && d.getMonth() !== now.getMonth()) return false;
    if (period === "year" && d.getFullYear() !== now.getFullYear()) return false;

    if (division !== "all" && t.division !== division) return false;
    if (category !== "all" && t.category !== category) return false;

    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(toDate)) return false;

    return true;
  });

  const income = filtered.filter(t=>t.type==="income")
    .reduce((a,b)=>a+Number(b.amount),0);

  const expense = filtered.filter(t=>t.type==="expense")
    .reduce((a,b)=>a+Number(b.amount),0);

  const balance = income - expense;

  const categorySummary = {};
  filtered.forEach(t=>{
    if(!categorySummary[t.category]) categorySummary[t.category]=0;
    categorySummary[t.category]+=Number(t.amount);
  });

  const categories = [...new Set(transactions.map(t=>t.category))];

  return (
    <div className="p-6 space-y-6">

      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h1 className="text-2xl font-bold">Money Manager</h1>

        <div className="flex flex-wrap gap-2">

          <select value={period} onChange={e=>setPeriod(e.target.value)} className="border px-2 py-1 rounded">
            <option value="all">All</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>

          <select value={division} onChange={e=>setDivision(e.target.value)} className="border px-2 py-1 rounded">
            <option value="all">All Divisions</option>
            <option value="Personal">Personal</option>
            <option value="Office">Office</option>
          </select>

          <select value={category} onChange={e=>setCategory(e.target.value)} className="border px-2 py-1 rounded">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>

          <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} className="border px-2 py-1 rounded"/>
          <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} className="border px-2 py-1 rounded"/>

          <button onClick={()=>setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add
          </button>
        </div>
      </div>

      <Transfer onDone={load} api={API} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Income" value={income} color="green"/>
        <Card title="Expense" value={expense} color="red"/>
        <Card title="Balance" value={balance} color="blue"/>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-3">Category Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(categorySummary).map(([k,v])=>(
            <div key={k} className="border p-2 rounded text-sm">
              {k}: ₹{v}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-3">History</h2>

        {filtered.length===0 && <p>No transactions</p>}

        {filtered.map(t=>(
          <div key={t.id} className="border p-3 rounded mb-2 flex justify-between">
            <div>
              <p className="font-medium">{t.category}</p>
              <p className="text-sm">{t.description} • {t.division}</p>
            </div>
            <div className="font-bold">
              {t.type==="income" && "+"}
              {t.type==="expense" && "-"}
              {t.type==="transfer" && "↔"}
              ₹{t.amount}
            </div>
          </div>
        ))}
      </div>

      {open && <AddTransactionModal onClose={()=>{setOpen(false);load();}} api={API}/>}
    </div>
  );
}

function Card({title,value,color}){
  const map={green:"text-green-600",red:"text-red-600",blue:"text-blue-600"};
  return (
    <div className="bg-white p-4 rounded shadow">
      <p>{title}</p>
      <p className={`text-xl font-bold ${map[color]}`}>₹{value}</p>
    </div>
  );
}
