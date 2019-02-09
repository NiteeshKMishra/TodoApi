const { mongoose } = require('../db/mongoose');

var user = mongoose.model('user', {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

module.exports = { user }