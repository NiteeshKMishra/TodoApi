const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server/server');

const { todo } = require('../models/todos');

const { users, userOneID, userTwoID } = require('./users.test');

const todos = [
  { _userid: userOneID, _id: new ObjectID(), text: 'First test todo' },
  { _userid: userTwoID, _id: new ObjectID(), text: 'Second test todo' }];

beforeEach((done) => {
  todo.insertMany(todos).then(() => done());
});

afterEach((done) => {
  todo.deleteMany({}).then(() => done());
});
//Post Todos TestCases
describe('Todos /POST', function () {
  this.timeout(5000);

  it('should post a new todo', (done) => {
    var text = 'Test Todo Post API';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err)
          return done(err);
        todo.find({ text }).
          then((result) => {
            expect(result.length).toBe(1);
            expect(result[0].text).toBe(text);
            done();
          }).
          catch((err) => {
            done(err);
          })
      })
  });

  it('should not create a todo', (done) => {
    request(app).
      post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(404)
      .end((err, res) => {
        if (err)
          return done(err);
        todo.find().then((result) => {
          expect(result.length).toBe(2);
          done();
        })
          .catch((err) => {
            done(err);
          });
      })
  })
});

//GET todos TestCases

describe('GET /todos', function () {
  this.timeout(5000);

  it('should get a todo', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.docs.length).toBe(1);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        todo.findOne({ _userid: users[1]._id })
          .then((result) => {
            expect(result._userid).toNotBe(users[1]._id);
            done();
          })
          .catch((err) => done(err));
      });
  });
});

//GET by ID testcases

describe('GET /todos:id', function () {
  this.timeout(5000);

  it('should get a todo by ID', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.docs.text).toBe(todos[0].text);
        expect(res.body.docs._userid).toNotBe(users[1]._id);
      })
      .end(done);
  });

  it('should not get a todo by ID', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should not get a todo by invalid ID', (done) => {
    request(app)
      .get(`/todos/${123}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

//Delete by ID TestCases

describe('Delete /todos:id', function () {
  this.timeout(5000);

  it('should delete a todo by ID', (done) => {
    request(app)
      .delete(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.docs.text).toBe(todos[1].text);
        expect(res.body.docs._userid).toNotBe(users[0]._id.toHexString());
      })
      .end((err, res) => {
        if (err)
          return done(err);
        todo.findOne({ _userid: users[1]._id })
          .then((result) => {
            expect(result).toBe(null);
            done();
          })
          .catch((err) => done(err));
      });
  });

  it('should not delete a todo by ID', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should not delete a todo by invalid ID', (done) => {
    request(app)
      .delete(`/todos/${123}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

//Patch TestCases
describe('Patch /todos:id', function () {
  this.timeout(5000);
  it('should patch a todo by ID', (done) => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ text: 'New First test todo', completed: true })
      .expect(200)
      .expect((res) => {
        expect(res.body.docs.text).toBe('New First test todo');
        expect(res.body.docs.completed).toBe(true);
      })
      .end((err, res) => {
        if (err)
          return done(err);
        todo.findById(todos[0]._id)
          .then((result) => {
            expect(result.text).toBe('New First test todo');
            expect(result.completed).toBe(true);
            done();
          })
          .catch((err) => done(err));
      });
  });

  it('should not patch a todo by ID', (done) => {
    request(app)
      .patch(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should not delete a todo by invalid ID', (done) => {
    request(app)
      .patch(`/todos/${123}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});