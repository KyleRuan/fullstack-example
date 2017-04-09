/**
 * Created by kyle on 2017/3/18.
 */

var MongoClient = require('mongodb').MongoClient;

var url =  'mongodb://localhost:27017/myproject';

/**
 * return db
 */
var connectDB = function () {
  var client =  new MongoClient(new Server('localhost',27017),{
        socketOptions:{connectTimeoutMS:500},
        poolSize:5,
        auto_reconnect:true
      },
      {numberOfRetries:3,
        retryMillSeconds:500
      }
  );
  console.log("Connection Failed Via Client Object");
  console.log(client);
  client.connect(url,function (err,db) {
    if (err) {
      console.log("Connection Failed Via Client Object");
      console.log(err);
    } else {
      //
      return db;
    }
  })
};

// 插入
var insertDocuments = function(db,data, callback) {
  // Get the documents collection

  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
};


exports.connectDB = connectDB;
exports.insertDocuments = insertDocuments;
