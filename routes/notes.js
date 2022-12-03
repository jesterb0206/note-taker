const notes = require("express").Router();
const {v4: uuidv4} = require("uuid");
const notesDb = require("../db/db.json");
const fs = require("fs");

// Sends the notes in db.json to the client

notes.get("/", (req, res) => {
  res.json(notesDb);
  console.info(`${req.method} method received to read note!`);
});

notes.post("/", (req, res) => {
  // Allows you to be able to access the new note data from req.body

  const {title, text} = req.body;
  let id = uuidv4();

  if (title && text) {
    const newNote = {
      title,
      text,
      id,
    };

    // Adds the new note to the existing list of notes in the database

    notesDb.push(newNote);

    const noteString = JSON.stringify(notesDb, null, 3);

    // Allows the updated note list to be written to the db.json file

    fs.writeFile(`./db/db.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(`A new note has been added to the JSON file!`)
    );
    const response = {
      status: "success",
      body: newNote,
    };
    res.status(201).json(response);
  } else {
    res.status(500).json("Unable to add the new note to the JSON file!");
  }
});

notes.delete("/:id", (req, res) => {
  if (req.params.id) {
    console.info(`${req.method} method received to delete note!`);
    const noteId = req.params.id;
    let idMatches = false;

    // Finds the note in db.json with the corresponding parameter id and removes it from the file

    for (let i = 0; i < notesDb.length; i++) {
      const currentNote = notesDb[i];
      if (currentNote.id === noteId) {
        notesDb.splice(i, 1);
        idMatches = true;
      }
    }
    if (idMatches) {
      const noteString = JSON.stringify(notesDb, null, 2);

      // Allows the changes to be reflected in the db.json file

      fs.writeFile(`./db/db.json`, noteString, (err) =>
        err ? console.error(err) : console.log(`The JSON file has been updated`)
      );
      return;
    }
    res.send("Unable to find the note in the JSON file!");
  } else {
    res.send("A note ID was not provided!");
  }
});

module.exports = notes;
