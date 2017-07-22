var express = require('express');
var mongo = require('mongodb').MongoClient;
var validUrl =  require('valid-url');
var shortId = require('shortid');
var dbUrl = 'mongodb://edwin:lomolo@ds029824.mlab.com:29824/urls'

var app = express();

//Static files Middleware
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "index.html");
});

app.get('/new/:url(*)', (req, res) => {
  var url = req.params.url;
  if (validUrl.isUri(url)) {
    //db connection
    mongo.connect(dbUrl, (err, db) => {
      if(err) {
        res.send("Connection to the database was lost! Please try later");
        return console.log(err);
      } else {
        console.log("Connection alive");
        var urlList = db.collection('url-shortener');
        var short = shortId.generate();
        urlList.insert({url: url, short: short}, () => {
          var data = {
            originalUrl: url,
            shortUrl: 'http://' + req.headers['host'] + '/' + short,
          }
          db.close();
          res.send(data);
        });
      }
    });
  } else {
    var data = {
      error: 'Please check your input for mistakes',
    }
    res.json(data);
  }
});

app.get('/:value', (req, res) => {
  var value = req.params.value;
  mongo.connect(dbUrl, (err, db) => {
    if (err) {
      return console.log(err);
    } else {
      var urlList = db.collection('url-shortener');
      urlList.find({short: id}).toArray((err, docs) => {
        if(err) {
          res.send("Please check you input for mistakes!");
        } else {
          console.log(docs.length);
        }
      });
    }
  });
});

app.listen(3000, '127.0.0.1', () => {
  console.log("Server listening on port 3000!");
});