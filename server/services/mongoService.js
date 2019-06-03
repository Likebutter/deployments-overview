var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/deployments-overview"
var user = "admin"
var collection_name = "deployments-overview"

connectWithCallback = function(callback, object) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err
    let dbo = db.db(user)
    callback(dbo, object)
    db.close()
  });
}

insertElement = function(dbo, object) {
    dbo.collection(collection_name).insertOne(object, function(err, res) {
      if (err) throw err
      console.log("1 document inserted")
    });
}

getElements = function(dbo) {
  dbo.collection("customers").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
  });
}

exports.insert = function(object) {
    connectWithCallback(insertElement, object)
}

exports.getActiveJobs = function() {
   connectWithCallback(getElements)
}
