//const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log('Unable to connect to DataBase');
  }
  const db = client.db('TodoApp');
  console.log('Connected to the DataBase');
  // db.collection('Todos').insertOne({
  //   _id: new ObjectID(),
  //   text: 'Something New to Insert',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to add new Document');
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  db.collection('Users').insertOne({
    _id: new ObjectID(),
    name: 'Niteesh',
    Age: 25,
    location: 'India'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to add new Document: ' + err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
    console.log('TimeStamp of First Document is: ' + result.ops[0]._id.getTimestamp());
  });

  client.close();
})