const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { SHA256 } = require('crypto-js')

const { app } = require('../server/server');

const { User } = require('../models/users');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [{
  _id: userOneID,
  email: 'nitish219@gmail.com',
  password: SHA256('abc123').toString(),
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

beforeEach(function (done) {
  this.timeout(5000);
  User.deleteMany({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo])
  }).then(() => done());
});


describe('Users /GET', function () {
  this.timeout(5000);

  it('should get the User', (done) => {

    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done);
  });

  it('should fail the Authentication', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token + '1')
      .expect(401)
      .expect((res) => {
        expect(res.body.Message).toBe('Invalid Authentication');
      })
      .end(done);
  })
});

describe('Users /Post TestCases', function () {
  it('should post the valid user', (done) => {
    var email = 'nitish420@gmail.com';
    var password = 'nitish123';
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(email);
        expect(res.header['x-auth']).toExist();
      })
      .end((err) => {
        if (err)
          return done(err);
        User.findOne({ email }).then((user) => {
          expect(user.email).toBe(email);
          expect(user.password).toNotBe(password);
          done();
        })
      })
  })

  it('should not post a valid user', (done) => {
    request(app)
      .post('/users')
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.body.Message).toBe('Insertion Unsuccessfull');
      })
      .end(done);
  });
});

describe('Users /login', () => {
  it('should get the user login', (done) => {
    var email = users[0].email;
    var password = 'abc123';

    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toExist();
        expect(res.header['x-auth']).toExist();
      })
      .end(done)
  });

  it('should not let user login', (done) => {
    var email = users[0].email;
    var password = 'abc126fvx';

    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(401)
      .expect((res) => {
        expect(res.body.Message).toBe('Please Enter a valid password');
      })
      .end(done);
  });
});

describe('Users /Delete', function () {
  this.timeout(5000);

  it('should get the User', (done) => {

    request(app)
      .delete('/users/logout')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err)
          return done(err)
        User.findById(userOneID)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch((e) => done(e))
      });
  });
}); 