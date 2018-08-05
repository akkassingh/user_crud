var mongodb = require('mongodb').MongoClient;
var express  = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;
//>>>>>>>>>>>>>>>>>>>> MongoDb url <<<<<<<<<<<<<<<<<<<<//
var mongourl = //'';
//>>>>>>>>>>>>>>>>>>>> ********** <<<<<<<<<<<<<<<<<<<<//
var collection_name = 'users';



var dataBase = function(myobj){
  MongoClient.connect(url, function(err, db) {
    console.log(" i am here at addData")
    if (err) throw err;
    var dbo = db.db("testData1");
    dbo.collection("first").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  }); 
}

//Update Data
dataBase.prototype.update = function(query, myobj){
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("testData1");
  dbo.collection("second").update(query, myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
  });
});
}

dataBase.prototype.delete = function(myquery){
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("testData1");
    dbo.collection('second').deleteOne(myquery,function(err,res){
      if(err) throw err;
      console.log("data deleted");
      db.close()
    })
  })
}


dataBase.prototype.findAll = function(colName, callback){
  MongoClient.connect(url, function(err, db){
    if(err) throw err;
    var dbo = db.db("testData1")
    dbo.collection(colName).find({}).toArray(
        function(err,results){
         callback(results)
        })
  })
}

module.exports = dataBase;