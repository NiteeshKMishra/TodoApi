const { mongoose } = require('../db/mongoose');
const validate = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema(
  {
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
  }
);

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();
  user.tokens.push({ access, token });
  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }
  catch (e) {
    return Promise.reject('Invalid Authentication');
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

var User = mongoose.model('user', UserSchema);

module.exports = { User }