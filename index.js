const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

app.use(require("./routes/top"));
app.use(require("./routes/history"));

app.all("*", (req, res) => {
  res.status(404).json({ message: "route not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Phil, server is started 🚘");
});
