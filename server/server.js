require('../config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { mongoose, ObjectID } = require('../db/mongoose');
const { todo } = require('../models/todos');
const { User } = require('../models/users');
const { authenticate } = require('../middleware/authenticate');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());


app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateToken()
        .then((token) => {
          res.header('x-auth', token).status(200).send(user);
        })
    })
    .catch((err) => {
      res.status(400).send({ Message: err })
    });
});

app.delete('/users/logout', authenticate, (req, res) => {
  req.user.deleteToken(req.token)
    .then(() => {
      res.status(200).send({ Message: 'User is Logout Successfully' })
    })
    .catch((err) => {
      res.status(400).send({ Message: err });
    });
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var newUser = new User(body);
  newUser.save().then(
    () => {
      return newUser.generateToken();
    }).then((token) => {
      res.header('x-auth', token).status(200).send(newUser);
    }).catch(
      (err) => {
        res.status(404).send('Insertion Unsuccessful ' + err.message);
      });
});

app.get('/users/me', authenticate, (req, res) => {
  res.status(200).send(req.user);
});

app.post('/todos', authenticate, (req, res) => {
  var newTodo = new todo({
    _userid: req.user._id,
    text: req.body.text
  });

  newTodo.save().then((docs) => {
    res.status(200).send(docs);
  }, (err) => {
    res.status(404).send('Insertion Unsuccessfull ' + err.message);
  });
});

app.get('/todos', authenticate, (req, res) => {
  todo.find({ _userid: req.user._id }).
    then(
      (docs) => {
        res.status(200).send({ docs });
      },
      (err) => {
        res.status(400).send(err.message);
      });
})

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id is not Valid. Please Enter a Valid ID');
  }
  todo.findOne({ _id: id, _userid: req.user._id }).then(
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

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id is not Valid. Please Enter a Valid ID');
  }
  todo.findOneAndDelete({ _id: id, _userid: req.user._id }).then((docs) => {
    if (docs) {
      res.status(200).send({ docs });
    }
    else {
      res.status(404).send('No Matching Record Found');
    }
  }, (err) => {
    res.status(404).send(err.message);
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id is not Valid. Please Enter a Valid ID');
  }

  if (_.isBoolean(body.completed) && body.completed === true) {
    body.completedAt = new Date().toString();
  }
  else {
    body.completed = false;
    body.completedAt = null;
  }

  todo.findOneAndUpdate({ _id: id, _userid: req.user._id }, { $set: body }, { new: true }).then((docs) => {
    if (docs) {
      res.status(200).send({ docs });
    }
    else {
      res.status(404).send('No Matching Record Found');
    }
  }, (err) => {
    res.status(404).send(err.message);
  });
});

app.listen(port, () => {
  console.log('Listning to port ' + port)
})

module.exports.app = app;