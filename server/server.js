const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: String
  }
});

var firstTodo = new Todo({
  text: 'Make Dinner',
  completed: true,
  completedAt: new Date().toDateString()
});

firstTodo.save().then((docs) => {
  console.log('Insertion SuccessFull');
  console.log(docs);
}, (err) => {
  console.log('Unable to Insert data: ' + err.message);
});