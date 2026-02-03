const express = require("express");
const cors = require("cors");

const txRoutes = require("./routes/transactions");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/transactions", txRoutes);

app.get("/", (req, res) => {
  res.send("Money Manager API running");
});

module.exports = app;
