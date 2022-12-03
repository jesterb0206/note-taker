const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("./uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// HTML Routes

// Returns index.html file

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Returns notes.html file

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Sends the notes in db.json to the client

app.get("/api/notes", (req, res) => {
  var grabNotes = fs.readFileSync("./db/db.json");
  var displayNotes = JSON.parse(grabNotes);
  return res.json(displayNotes);
});

// Save new notes to the JSON file

app.post("/notes", (req, res) => {
  // Adds a unique ID to each note being added to the JSON file

  const {title, text} = req.body;
  const id = uuid();
  const newNote = {title, text, id};

  var savedNotes = fs.readFileSync("./db/db.json");
  var savedArray = JSON.parse(savedNotes);

  savedArray.push(newNote);

  var newData = JSON.stringify(savedArray);
  fs.writeFile("./db/db.json", newData, (err) => {
    err ? console.error("Unsuccessful!") : console.log("Successful!");
  });
  res.json("A new note has been added!");
});

// Deletes a note and updates the page

app.delete("/api/notes/:id", (req, res) => {
  var deleteData = fs.readFileSync("./db/db.json");
  var deleteArray = JSON.parse(deleteData);

  newArray = deleteArray.filter(function (item) {
    return item.id != req.params.id;
  });

  var newArrayFile = JSON.stringify(newArray);
  fs.writeFile("./db/db.json", newArrayFile, (err) => {
    err ? console.error("Unsuccessful!") : console.log("Successful!");
  });
  res.json("The note has successfully been deleted!");
});

// Listening on PORT 3001

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
