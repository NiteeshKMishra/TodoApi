const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { app } = require('../server/server');

const { User } = require('../models/users');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [{
  _id: userOneID,
  email: 'nitish219@gmail.com',
  password: 'abc123',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userOneID.toHexString(), access: 'auth' }, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoID,
  email: 'nitishmishra219@gmail.com',
  password: 'abc123',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userTwoID.toHexString(), access: 'auth' }, process.env.JWT_SECRET).toString()
  }]
}];

beforeEach((done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo])
  }).then(() => done());
});

describe('Users /GET', () => {
  it('should fail the authentication', (done) => {

    request(app)
      .get('/users/me')
      .expect(200)
      .end(done);
  });
});