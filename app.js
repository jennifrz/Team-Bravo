var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var admin = require("firebase-admin");

var serviceAccount = require("./shawp-124fc-firebase-adminsdk-e0xgp-48ef17e594.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://shawp-124fc.firebaseio.com"
});

var database = admin.database();

// var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var sendMessageRouter = require('./routes/sendMessage');
var createListingRouter = require('./routes/createListing');
var updateListingRouter = require('./routes/updateListing');
var makeOfferRouter = require('./routes/makeOffer');
var declineOfferRouter = require('./routes/declineOffer');
var acceptOfferRouter = require('./routes/acceptOffer');
var deleteListingRouter = require('./routes/deleteListing');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/sendMessage', sendMessageRouter);
app.use('/createListing', createListingRouter);
app.use('/updateListing', updateListingRouter);
app.use('/makeOffer', makeOfferRouter);
app.use('/declineOffer', declineOfferRouter);
app.use('/acceptOffer', acceptOfferRouter);
app.use('/deleteListing', deleteListingRouter);

app.set('database', database);

// module.exports = app;

var debug = require('debug')('myapp:server');
var http = require('http');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
