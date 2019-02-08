//const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log('Unable to connect to DataBase');
  }
  const db = client.db('TodoApp');
  console.log('Connected to the DataBase');
  // db.collection('Users').find({ _id: new ObjectID('5c5cfe4ea86fe11d8c98a619') }).toArray().then((docs) => {
  //   console.log(JSON.stringify(docs, undefined, 2));
  //   client.close();
  // }, (err) => {
  //   console.log('Unable to Fetch Value, Error: ' + err);
  //   client.close();
  // });

  db.collection('Users').find({ name: 'Niteesh' }).count().then((count) => {
    console.log('Number of Documents: ' + count)
    client.close();
  }, (err) => {
    console.log('Unable to Fetch Value, Error: ' + err);
    client.close();
  });

  //client.close();
})