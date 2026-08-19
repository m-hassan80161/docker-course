
const express = require("express");

const PORT = 4000;
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>hello from test app hi hi2 hi3</h1>");
});

app.listen(PORT, () => {
  console.log(`The App Is running On Port ${PORT}`);
});

