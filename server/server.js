
var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) =>{
    res.status(400).send(e);
  })
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
   return res.status(404).send({});
  }
  
  Todo.findById(id).then((doc) =>{
    if(!doc){
      return res.status(400).send({});
     }
    res.send(doc);
  }).catch((e) => {
    return res.status(400);

  })

  //validate id if valid then respond 404
    // send empty body

  //findbyId
    // success
      // if todo send back
      // if no todo - send back a 404 with empty body
    // error
      // 400 -- 
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {
  app
}
