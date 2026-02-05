import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://money-1manager-7.onrender.com";

export default function Transfer({ onDone }) {
  const [accounts,setAccounts]=useState([]);
  const [fromId,setFromId]=useState("");
  const [toId,setToId]=useState("");
  const [amount,setAmount]=useState("");

  useEffect(()=>{
    axios.get(`${API}/transactions/accounts/list`)
      .then(r=>setAccounts(r.data));
  },[]);

  const submit = async ()=>{
    await axios.post(`${API}/transactions/accounts/transfer`,{
      fromId,toId,amount
    });
    onDone();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="mb-2 font-semibold">Transfer Between Accounts</h2>

      <div className="flex gap-2">
        <select onChange={e=>setFromId(e.target.value)} className="border p-1">
          <option>From</option>
          {accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
        </select>

        <select onChange={e=>setToId(e.target.value)} className="border p-1">
          <option>To</option>
          {accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
        </select>

        <input type="number" placeholder="Amount"
          className="border p-1"
          onChange={e=>setAmount(e.target.value)}
        />

        <button onClick={submit}
          className="bg-purple-600 text-white px-3 rounded">
          Transfer
        </button>
      </div>

      <div className="text-sm mt-2">
        {accounts.map(a=>(
          <div key={a.id}>{a.name}: ₹{a.balance}</div>
        ))}
      </div>
    </div>
  );
}