const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('../db/mongoose');
const { todo } = require('../models/todos');
const { user } = require('../models/users');

var app = express();

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

app.listen(3000, () => {
  console.log('Listning to port 3000')
})

// var firstTodo = new todo({
//   text: 'Make him Cry',
// });



// var firstUser = new user({
//   name: 'Niteesh',
//   email: 'nitish219@gmail.com'
// })

// firstUser.save().then(
//   (docs) => {
//     console.log('Insertion SuccessFull');
//     console.log(docs);
//   },
//   (err) => {
//     console.log('Unable to Insert data: ' + err.message);
//   });