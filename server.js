const express = require("express");
const path = require("path");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

// HTML routes

// Returns index.html file

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// Returns notes.html file

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.use("api", routes);

// Listening on PORT 3001

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
