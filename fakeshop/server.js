var express = require('express'),
  app = express(),
  port = 4343,
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.send('Hello World!')
});

var http = require("http");

app.use('/static', express.static('public'))

var routes = require('./api/routes/fakeShopRoutes'); //importing route
routes(app, http); //register the route

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
