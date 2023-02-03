const express = require('express');
const path = require('path');
const files = require('fs');
const utility = require('util');
const readFile = utility.promisify(files.readFile);
const writeFile = utility.promisify(files.writeFile);
const { v4: uniqueId } = require('uuid');
const myApp = express();
const PORT = process.env.PORT || 3001;

//Middleware
myApp.use(express.json());
myApp.use(express.static('public'));
myApp.use(express.urlencoded({extended:false}));

//Read datebase file and parse it using json
const findNotes = () => {
  return readFile('db/db.json', 'utf-8')
  .then(baseNotes => [].concat(JSON.parse(baseNotes)))
}


//GET Route for home page
myApp.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//Get Route for notes page
myApp.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


//Display notes
myApp.get('/api/notes', (req, res) => {
    findNotes()
    .then(notes => res.json(notes))
    .catch(err => res.status(400).json(err))
    });
    
//Updating notes request
myApp.post('/api/notes', ({body}, res) => {
    findNotes()
    .then(currentNotes => {
    const newNotes = [...currentNotes, {title: body.title, text: body.text, id: uniqueId()}]
    writeFile('db/db.json', JSON.stringify(newNotes))
    .then(() => res.json({msg: 'ok'}))
    .catch(err => res.status(400).json(err))
    })
})

//Bonus
myApp.delete('/api/notes/:id', (req, res) => {
    findNotes().then(currentNotes => {
      let newNotes = currentNotes
      .filter(note => note.id !== req.params.id)
      writeFile('db/db.json', JSON.stringify(newNotes))
      .then(() => res.json({msg: 'ok'}))
      .catch(err => res.status(400).json(err))
    })
  })

myApp.listen(PORT, () => console.log(`App port: ${PORT}!`));