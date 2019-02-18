const { mongoose } = require('../db/mongoose');

var todo = mongoose.model('Todo', {

  _userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
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