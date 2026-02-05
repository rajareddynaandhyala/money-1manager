import { useEffect, useState } from "react";
import axios from "axios";
import AddTransactionModal from "../components/AddTransactionModal";
import Transfer from "../components/Transfer";

const API = "https://money-1manager-7.onrender.com";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const load = async () => {
    const res = await axios.get(`${API}/transactions`);
    setTransactions(res.data);
  };

  useEffect(() => { load(); }, []);

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((a,b)=>a+Number(b.amount),0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((a,b)=>a+Number(b.amount),0);

  const balance = income - expense;

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold">Money Manager</h1>

      <button
        onClick={()=>setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Add
      </button>

      <Transfer onDone={load} />

      <div className="grid grid-cols-3 gap-4">
        <Card title="Income" value={income} color="green"/>
        <Card title="Expense" value={expense} color="red"/>
        <Card title="Balance" value={balance} color="blue"/>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">History</h2>

        {transactions.map(t=>(
          <div key={t.id} className="border p-2 mb-2 rounded flex justify-between">
            <span>{t.category} • {t.division}</span>
            <span>
              {t.type==="income" && "+"}
              {t.type==="expense" && "-"}
              ₹{t.amount}
            </span>
          </div>
        ))}
      </div>

      {open && <AddTransactionModal onClose={()=>{setOpen(false);load();}} />}
    </div>
  );
}

function Card({title,value,color}){
  const map={
    green:"text-green-600",
    red:"text-red-600",
    blue:"text-blue-600"
  };

  return(
    <div className="bg-white p-4 rounded shadow">
      <p>{title}</p>
      <p className={`text-xl font-bold ${map[color]}`}>₹{value}</p>
    </div>
  );
}