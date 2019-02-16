const { mongoose } = require('../db/mongoose');
const validate = require('validator');

var user = mongoose.model('user', {
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validate.isEmail,
      message: `{Value} is not a Valid Email ID`

    }
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

module.exports = { user }