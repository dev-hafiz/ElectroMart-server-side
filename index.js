const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ElectroMart server running...");
});

app.listen(port, () => {
  console.log(`ElectroMart server running on port ${port}`);
});