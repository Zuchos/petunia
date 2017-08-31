var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.send('Hello World!')
});

var routes = require('./api/routes/petuniaRoutes'); //importing route
routes(app, web3); //register the route

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
