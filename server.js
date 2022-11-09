// Require Functions //

const app = express();
const express = require("express");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3001;
const { v4: uuid4 } = require("uuid");

// Global Variable //

var savedNotes = require("./db/db.json");

// Middleware Functions //

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Local Port Listening //

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

// HTML Routes //

// Returns the index.html file //

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Returns the notes.html file //

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API Routes //

// Retrieves Notes from JSON File //

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "db/db.json"));
  console.log(`${req.method} request received to retrieve notes`);
});

// Receives a new note to save on the request body, adds it to the db.json file, and then returns the new note to the client. //

app.post("api/notes", (req, res) => {
  console.info(`${req.method} request received to add a new note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid4(),
    };

    const response = {
      status: "success",
      body: newNote,
    };

    savedNotes.push(newNote);

    fs.writeFile("db/db.json", JSON.stringify(savedNotes), function (err) {
      if (err) throw err;
    });
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting note");
  }
});

// Deletes a note with a press of a button //

app.delete("/api/notes/:id", function (req, res) {
  res.send(`${req.method} request received to delete the note`);
  console.log(`${req.method} request received to delete the note`);

  const id = req.params.id;

  if (id) {
    savedNotes = savedNotes.filter((item) => item.id !== id);

    fs.writeFile("db/db.json", JSON.stringify(savedNotes), function (err) {
      if (err) throw err;
      else {
        console.log(`Note ID: ${id} deleted`);
      }
    });
  }
});

// Returns user to the homepage //

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
