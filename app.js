
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose')
  , http = require('http')
  , MongoStore = require('connect-mongo')(express)
  , path = require('path');

var flash = require('connect-flash');



var app = express();

//mongo uri
app.set('mongodb-uri', 'mongodb://localhost');

//setup mongoose
app.db = mongoose.createConnection(app.get('mongodb-uri'));
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  console.log('mongoose open for business');
});

//includes the css/js files
app.use(express.static(__dirname + '/views/css/'));
app.use(express.static(__dirname + '/views/js/'));

// Import data models
require('./models')(app, mongoose);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
// app.engine('html', require('jade').__express);

var engines = require('consolidate');

app.set('views', __dirname + '/views');
app.engine('html', engines.ejs);
app.set('view engine', 'html');

app.use(express.logger('dev'));
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({
	secret: "sssshhhhhh, this is a secret",
	maxAge: new Date(Date.now() + 3600000)
}));
app.use(express.methodOverride());
app.use(flash());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));


// require('./lib/passport')(app, passport);
require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
