/**
 * Created by KyleRuan on 2017/4/9.
 */

var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var defaultCollection = "documents";
var url =  'mongodb://localhost:27017/myproject';
var currentDB ;
var client = new MongoClient(new Server('localhost',27017),{
      socketOptions:{connectTimeoutMS:500},
      poolSize:5,
      auto_reconnect:true
    },
    {numberOfRetries:3,
      retryMillSeconds:500
    });

 var connectedDB= function (callback) {
   client.connect(url,function (err,db) {
        currentDB = db;
       callback(err,db);
       // db's stats
       // db.stats(function (err,stats) {
       //   /**
       //    * { db: 'myproject',collections: 1,views: 0,objects: 27,avgObjSize: 29,
       // * dataSize: 783,storageSize: 36864,numExtents: 0,indexes: 1,indexSize: 36864,ok: 1 }
       //    */
       //   console.log(stats);
       // }；
   });

 }

//TODO: db的状态信息 stats

//TODO: collection stats

var deleteCollection = function (collectionName, callback) {
  if (currentDB) {
    currentDB.dropCollection(collectionName,function (err,results) {
      console.log(collectionName + "dropped")
      callback(err, results);
    });
  } else {
    connectedDB(function (err,db) {
      db.dropCollection(collectionName,function (err,results) {
        console.log(collectionName+"dropped")
        callback(err,results);
      });
    });
  }
}

// 文档的增删查改
/**
 * insert the many data the collectionName collection
 * @param data
 * @param collectionName
 * @param callback
 */
var insertToCollection = function(data,collectionName,callback) {
  if(typeof collectionName == 'function') {
    callback = collectionName;
    collectionName = defaultCollection;
  }
  connectedDB(function (err,db) {
    var collection = db.collection(collectionName);
    collection.insertMany(data, function(err, result) {
      callback(err,result);
    });
  });
};

var findAllItems = function (collectionName,callback) {
  if(typeof collectionName == 'function') {
    callback = collectionName;
    collectionName = defaultCollection;
  }
  if (currentDB) {
    var collection = currentDB.collection(collectionName);
    collection.find(function (err,items) {
      items.toArray(function (err,itemArr) {
        console.log(itemArr);
        callback(err,items);
      });
    })
  } else {
    connectedDB(function (err,db) {
      var collection = db.collection(collectionName);
      collection.find(function (err,items) {
        items.toArray(function (err,itemArr) {
          console.log(itemArr);
          callback(err,items);
        });
      });
    });
  }
}

var findItems = function (query,collectionName,callback) {
  if(typeof collectionName == 'function') {
    callback = collectionName;
    collectionName = defaultCollection;
  }
  if (currentDB) {
    var collection = currentDB.collection(collectionName);
    collection.find(query,function (err,items) {
      items.toArray(function (err,itemArr) {
        console.log(itemArr);
        callback(err,items);
      });
    })
  } else {
    connectedDB(function (err,db) {
      var collection = db.collection(collectionName);
      collection.find(query,function (err,items) {
        items.toArray(function (err,itemArr) {
          console.log(itemArr);
          callback(err,items);
        });
      });
    });
  }
}


var updateDocument = function(query,updateData,collectionName,callback) {
  // Get the documents collection
  if(typeof collectionName == 'function') {
    callback = collectionName;
    name = defaultCollection;
  }



  // updataData = {b:1}
  if (currentDB) {
    var collection = db.collection(collectionName);
    collection.updateOne(query
        , { $set: updateData }, function(err, result) {
          callback(result);
        });
  } else {
    connectedDB(function (err,db) {
      var collection = db.collection(collectionName);
      // Update document where a is 2, set b equal to 1
      collection.updateOne(query
          , { $set: updateData }, function(err, result) {
            callback(result);
          });
    });

  }

}

var updateCollection = function(query,updateData,collectionName,option,callback) {
  // Get the documents collection
  //3的时候
  if(typeof collectionName == 'function') {
    callback = collectionName;
    collectionName = defaultCollection;
    option = {};
  } else if (typeof collectionName == 'object'){
    callback = option;
    option = collectionName;
  } else if (typeof option == 'function'){
    callback = option;
    option={};
  }
  // option
  if (currentDB) {
    var collection = currentDB.collection(collectionName);
    collection.updateOne(query
        , { $set: updateData }, function(err, result) {
          callback(err,result);
        });
  } else {
    connectedDB(function (err,db) {
      var collection = db.collection(collectionName);
      // Update document where a is 2, set b equal to 1
      collection.updateOne(query
          , { $set: updateData }, function(err, result) {
            callback(err,result);
          });
    });

  }

}

var deleteItem = function (query,collectionName,callback) {
  if (typeof  query == 'function'){
    //delete all
    callback = query;
    collectionName = defaultCollection;
    query = {};
  } else  if (typeof  collectionName == 'function'){
     callback = collectionName;
    collectionName = defaultCollection;
  }

  // 设置好参数
  if(currentDB){
    var collection = currentDB.collection(collectionName);
    collection.remove(query,function (err,results) {
       callback(err,results);
    });
  } else {
    connectedDB(function (err,db) {
      var collection = db.collection(collectionName);
      collection.remove(query,function (err,results) {
        callback(err,results);
      });
    })
  }

}
exports.insertToCollection = insertToCollection;
exports.findAllItems = findAllItems;
exports.findItems = findItems;
exports.updateCollection = updateCollection;
exports.deleteItem = deleteItem;