const express = require("express");
const router = express.Router();

let transactions = [];

let accounts = [
  { id: 1, name: "Cash", balance: 0 },
  { id: 2, name: "Bank", balance: 0 },
];

// ---------- ADD TRANSACTION ----------

router.post("/", (req, res) => {
  const tx = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date()
  };

  transactions.unshift(tx);

  // update account balance
  if (tx.accountId) {
    const acc = accounts.find(a => a.id == tx.accountId);
    if (acc) {
      if (tx.type === "income") acc.balance += Number(tx.amount);
      if (tx.type === "expense") acc.balance -= Number(tx.amount);
    }
  }

  res.json(tx);
});

// ---------- LIST ----------

router.get("/", (req, res) => {
  res.json(transactions);
});

// ---------- EDIT (12h rule) ----------

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const tx = transactions.find(t => t.id === id);
  if (!tx) return res.status(404).send("Not found");

  const hours = (Date.now() - new Date(tx.createdAt)) / 3600000;
  if (hours > 12) return res.status(400).send("Edit window expired");

  Object.assign(tx, req.body);
  res.json(tx);
});

// ---------- ACCOUNTS ----------

router.get("/accounts/list", (req, res) => {
  res.json(accounts);
});

// ---------- TRANSFER ----------

router.post("/accounts/transfer", (req, res) => {
  const { fromId, toId, amount } = req.body;

  const from = accounts.find(a => a.id == fromId);
  const to = accounts.find(a => a.id == toId);

  if (!from || !to) return res.status(400).send("Invalid accounts");

  amountNum = Number(amount);

  from.balance -= amountNum;
  to.balance += amountNum;

  transactions.unshift({
    id: Date.now(),
    type: "transfer",
    amount: amountNum,
    category: "Transfer",
    division: "Personal",
    description: `${from.name} → ${to.name}`,
    createdAt: new Date()
  });

  res.send("ok");
});

module.exports = router;
