

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log('Unable to connect to DataBase');
  }
  const db = client.db('TodoApp');
  console.log('Connected to the DataBase');

  // db.collection('Users').findOneAndUpdate({ location: 'India' }, { $set: { name: 'Niteesh', age: 25 } }, { returnOriginal: false }).then((result) => {
  //   console.log(JSON.stringify(result.value, undefined, 2));
  //   client.close();
  // }, (err) => {
  //   console.log(err);
  //   client.close();
  // });


  db.collection('Users').findOneAndUpdate({ location: 'India' }, { $set: { name: 'Manish' }, $inc: { age: 1 } }, { returnOriginal: false }).then((result) => {
    console.log(JSON.stringify(result.value, undefined, 2));
    client.close();
  }, (err) => {
    console.log(err);
    client.close();
  });


})