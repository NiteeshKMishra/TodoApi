const { mongoose } = require('../db/mongoose');
const validate = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { SHA256 } = require('crypto-js')

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

UserSchema.methods.deleteToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: { token }
    }
  });
}

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  var newUser;
  password = SHA256(password).toString();
  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject('User is not present');
    }
    else if (user.password !== password) {
      return Promise.reject('Please Enter a valid password');
    }
    return Promise.resolve(user);
  })
}

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

UserSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) {
    user.password = SHA256(user.password).toString();
    next();
  }
  else {
    next();
  }
});

var User = mongoose.model('user', UserSchema);

module.exports = { User }