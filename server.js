const fs = require('fs');
const util = require('util');
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const PORT = process.env.PORT || 3001;

const getNotes = () => {
  return readFile('db/db.json', 'utf-8').then(rawNotes => [].concat(JSON.parse(rawNotes)))
}

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//GET Routes
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


//Routing
app.get('/api/notes', (req, res) => {
    getNotes().then(notes => res.json(notes))
    .catch(err => res.status(500).json(err))
    });
    
app.post('/api/notes', ({body}, res) => {
    getNotes().then(savedNotes => {
    const newNotes = [...savedNotes, {title: body.title, text: body.text, id: uuidv4()}]
    writeFile('db/db.json', JSON.stringify(newNotes)).then(() => res.json({msg: 'ok'}))
    .catch(err => res.status(500).json(err))
    })
})

app.listen(PORT, () => console.log(`App listening on port: ${PORT}.`));