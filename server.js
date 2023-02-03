const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const notes = JSON.parse(data);
      const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4()
      };
      notes.push(newNote);
      fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.json({ msg: 'ok' });
        }
      });
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const notes = JSON.parse(data).filter(note => note.id !== req.params.id);
      fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.json({ msg: 'ok' });
        }
      });
    }
  });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));