const express = require('express');
const app = express();
var CSVWriter = require('./lib/csv_writer.js');
var path = require("path");
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const PORT = 2000;
var db;

//>>>>>>>>>>>>>>>>>>>> MongoDb url <<<<<<<<<<<<<<<<<<<<//
var mongourl = //'';
//>>>>>>>>>>>>>>>>>>>> ********** <<<<<<<<<<<<<<<<<<<<//
// var mongoClass = require('./model/database.js');
var collection_name = 'users';

//tell Express to make this public folder accessible to the public by using a built-in middleware called express.static
app.use(express.static(__dirname + '/public'));
// The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());




app.set('view engine', 'ejs')
app.set('views', './views');

app.post('/addData', (req, res) => {
  console.log("Body received to add data is " + JSON.stringify(req.body));
  db.collection(collection_name).save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log("result is " + JSON.stringify(result));
    console.log('saved to database')
    res.redirect('/')
  })
})

app.get('/', (req, res) => {
  db.collection(collection_name).find().toArray((err, result) => {
    if (err) return console.log(err)
      // renders index.ejs
    console.log("Data received from db to show on index page is " + JSON.stringify(result));
    res.render('index.ejs', {
      data: result
    })
  })
})

app.post('/find_by_name', (req, res) => {
  console.log("Body received to add data is " + JSON.stringify(req.body));
  var name = req.body.id;
  db.collection(collection_name).find({
    first_name: name
  }).toArray((err, result) => {
    if (err) return console.log(err)
      // renders index.ejs
    console.log("Data received from db to show in Modal is " + JSON.stringify(result));
    res.send(result)
  })
})


/* Get route for downloading the dump */
app.get('/download', function(req, res) {
  console.log('inside the download route');
  var dates = getDayParameters(req);
  var start = dates.start;
  var end = dates.end;
  db.collection(collection_name).find().toArray((err, result) => {
    if (err) return console.log(err)
    console.log(result.length)
    if (result && result.length > 0) {
      var filename = 'dump.csv';
      var csv = new CSVWriter(filename);
      csv.write(getHeaders());
      for (var i in result) {
        csv.write(fetchRow(result[i]));
        console.log('current data ' + fetchRow(result[i]))
      }
      res.send(result)
    }
  })
});

/* Get route for downloading the dump */
// app.get('/download', function(req, res) {
//   console.log('inside the download route');
//     var dates = getDayParameters(req);
//     var start = dates.start;
//     var end = dates.end;
//     db.collection(collection_name).find( queryHash(start,end), function (result){
//         if(result && result.docs && result.docs.length > 0){
//             var filename = 'dump.csv';
//             var csv = new CSVWriter(filename);
//             csv.write(getHeaders());
//             for(var i in result.docs){
//                 csv.write(fetchRow(result.docs[i]));
//             }
//             csv.save(function(err){
//                 if(err === 'success'){
//                     console.log("name:" + path.resolve(__dirname + '/../' + filename));
//                     res.setHeader('Content-disposition', 'attachment; filename=' + filename);
//                     res.setHeader('Content-type', 'text/csv');
//                     var filepath = path.resolve(__dirname + '/../' + filename);
//                     res.sendFile(filepath, {}, function(){
//                         require('fs').unlink(filepath);
//                     });
//                 }
//                 else{
//                     res.send(err);
//                 }
//             });
//         }
//         else{
//             res.send("No data between: " + start + " to " + end);
//         }
//     });
// });


app.get('/new', (req, res) => {
  db.collection(collection_name).find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('admin.ejs', {
      data: result
    })
  })
})

app.get('/bkp', (req, res) => {
  db.collection(collection_name).find().toArray((err, result) => {
    if (err) return console.log(err)
      // renders index.ejs
    res.render('bkp.ejs', {
      data: result
    })
  })
})

app.put('/update_user', (req, res) => {
  console.log('i was called, and i am updating the db');
  console.log('Data received to update' + JSON.stringify(req.body));
  console.log('_id is ' + req.body._id);
  db.collection(collection_name)
    .findOneAndUpdate({
      "_id": req.body._id
    }, {
      $set: {
        last_name: req.body.last_name,
        first_name: req.body.first_name,
        email: req.body.email
      }
    }, {
      sort: {
        _id: -1
      },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})

app.delete('/delete_user', (req, res) => {
  console.log('i was called, and i am deleting entry from the db');
  console.log('Data i got is ' + JSON.stringify(req.body));
  db.collection(collection_name).findOneAndDelete({
    first_name: req.body.id
  }, (err, result) => {
    if (err) return res.send(500, err)
    res.send({
      message: 'success'
    })
  })
})

// app.get('/all', (req, res) => {
//The toArray method takes in a callback function that allows us to do stuff with quotes we retrieved from database
//  db.collection(collection_name).find({}).toArray(function(err, results) {
//    console.log(results)
// send HTML file populated with quotes here
//  })
//})


// app.listen(PORT, function() {
//   console.log('+++++++++++++++++++++++ Server listening on PORT '+PORT);
// })

MongoClient.connect(mongourl, (err, client) => {
  if (err) return console.log(err)
  db = client.db('userlist') // whatever your database name is
  app.listen(PORT, () => {
    console.log('+++++++++++++++++++++++ Server listening on PORT ' + PORT);
  })
})


/* Squish the data to remove unwanted terminators */
function squish(data) {
  return (typeof data === 'undefined' || data === null) ? '' : data.toString().replace(/"/g, '');
}

/* Get in Excel formatting */
function dateFormatXls(date) {
  var tDate = new Date(date);
  return tDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

/* Prints header of the CSV */
function getHeaders() {
  console.log('I was called to provide headers');
  return [
    "First Name",
    "Last Name",
    "Email Id",
  ];
}

/* Get the row in order */
function fetchRow(result) {
  console.log('i was called to provide row wise data');
  return [
    squish(result.first_name),
    squish(result.last_name),
    squish(result.email),
  ];

}


/* Gives the query on which data is fetched */
function queryHash(start, end, customer_code) {
  return {
    "selector": {
      "updated_at": {
        "$gt": start,
        "$lte": end
      },
    },
    "fields": [],
    "sort": [{
      "created_at": "desc"
    }]
  };
}

/* Handle s the parameters for date to generate the query */
function getDayParameters(req) {
  var noOfDays = req.query.d;
  var endDate = req.query.ed;
  if (typeof noOfDays === 'undefined') {
    noOfDays = 1;
  }
  if (typeof endDate === 'undefined') {
    endDate = (new Date());
  }
  endDate = new Date(endDate);
  var start = getStartDateString(endDate, noOfDays);
  var end = getDateString(endDate);
  return {
    start, end
  };
}

/* Returns start date in proper format */
function getStartDateString(endDate, noOfDays) {
  var dateStr = (new Date(endDate.getTime() - (noOfDays * 1000 * 60 * 60 * 24)));
  return getDateString(dateStr);
}

/* formats the date to fit in query */
function getDateString(dateStr) {
  return dateStr.toISOString();
  // return dateStr.getFullYear() + '-' + ('0' + (dateStr.getMonth() + 1) ).slice(-2) + '-' + ('0' + dateStr.getDate()).slice(-2);
}