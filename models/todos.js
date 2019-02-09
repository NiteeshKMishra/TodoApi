const { mongoose } = require('../db/mongoose');

var todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: String,
    default: new Date().toString()
  }
});

module.exports = { todo }