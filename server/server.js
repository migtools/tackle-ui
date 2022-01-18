const express = require("express");
const path = require("path");
const app = express(),
  bodyParser = require("body-parser");

const setupProxy = require("./setupProxy");

const port = 8080;

setupProxy(app);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
