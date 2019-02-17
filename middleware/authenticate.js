const { User } = require('../models/users');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject('No User was found');
      }
      req.user = user;
      req.token = token;
      next();
    }).catch((err) => {
      res.status(401).send({ 'Message': err })
    });
}

module.exports.authenticate = authenticate;