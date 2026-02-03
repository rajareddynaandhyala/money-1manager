import axios from "axios";
import { useState } from "react";

export default function AddTransactionModal({ onClose, api }) {
  const [tab,setTab]=useState("income");
  const [amount,setAmount]=useState("");
  const [category,setCategory]=useState("");
  const [division,setDivision]=useState("Personal");
  const [description,setDescription]=useState("");

  const submit = async e => {
    e.preventDefault();
    await axios.post(`${api}/transactions`,{
      type:tab,amount,category,division,description,accountId:1
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-5 rounded w-96">
        <div className="flex justify-between mb-3">
          <h2>Add Transaction</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="flex mb-3">
          <button onClick={()=>setTab("income")} className="flex-1 bg-green-500 text-white">Income</button>
          <button onClick={()=>setTab("expense")} className="flex-1 bg-red-500 text-white">Expense</button>
        </div>

        <form onSubmit={submit} className="space-y-2">
          <input required type="number" placeholder="Amount" className="border p-2 w-full" onChange={e=>setAmount(e.target.value)}/>
          <input placeholder="Category" className="border p-2 w-full" onChange={e=>setCategory(e.target.value)}/>
          <select className="border p-2 w-full" onChange={e=>setDivision(e.target.value)}>
            <option>Personal</option>
            <option>Office</option>
          </select>
          <input placeholder="Description" className="border p-2 w-full" onChange={e=>setDescription(e.target.value)}/>
          <button className="bg-blue-600 text-white w-full p-2 rounded">Save</button>
        </form>
      </div>
    </div>
  );
}
