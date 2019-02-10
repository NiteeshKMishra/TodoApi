const express = require('express');
const bodyParser = require('body-parser');

const { mongoose, ObjectID } = require('../db/mongoose');
const { todo } = require('../models/todos');
const { user } = require('../models/users');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req.body);
  var newTodo = new todo({
    text: req.body.text
  });

  newTodo.save().then((docs) => {
    console.log('Insertion SuccessFull');
    res.status(200).send(docs);
  }, (err) => {
    res.status(404).send('Insertion Unsuccessfull ' + err.message);
  });
});

app.post('/users', (req, res) => {
  console.log(req.body);
  var newUser = new user({
    name: req.body.name,
    email: req.body.email
  });

  newUser.save().then(
    (docs) => {
      console.log('Insertion Successful');
      res.status(200).send(docs);
    },
    (err) => {
      res.status(404).send('Insertion Unsuccessful ' + err.message);
    });

});

app.get('/todos', (req, res) => {
  console.log(req.body);
  todo.find().
    then(
      (docs) => {
        res.status(200).send(docs);
      },
      (err) => {
        res.status(400).send(err.message);
      });
})

app.get('/users', (req, res) => {
  console.log(req.body);
  user.find().then((docs) => {
    res.status(200).send(docs);
  }, (err) => {
    res.status(404).send(err.message);
  });
})

app.get('/users/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id is not Valid. Please Enter a Valid ID');
  }
  user.findById(req.params.id).then(
    (docs) => {
      if (docs) { res.status(200).send({ docs }); }
      else {
        res.status(404).send('No Matching Record Found');
      }
    },
    (err) => {
      res.status(404).send(err.message);
    });
})

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id is not Valid. Please Enter a Valid ID');
  }
  todo.findById(id).then(
    (docs) => {
      if (docs) {
        res.status(200).send({ docs });
      }
      else {
        res.status(404).send('No Matching Record Found');
      }
    },
    (err) => {
      res.status(404).send(err.message);
    });
})

app.listen(port, () => {
  console.log('Listning to port ' + port)
})