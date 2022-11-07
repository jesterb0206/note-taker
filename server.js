// Require Functions

const app = express();
const express = require("express");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3001;
const { v4: uuid4 } = require("uuid");

// Global Variable

var savedNotes = require("./db/db.json");

// Middleware Functions

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Local Port Listening

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
