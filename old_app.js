
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , http = require('http')
  , MongoStore = require('connect-mongo')(express)
  , path = require('path');

var flash = require('connect-flash');

// get config
var konphyg = require('konphyg')(__dirname + '/conf/');
var config = konphyg.all();

var app = express();

//mongo uri
app.set('mongodb-uri', process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://twit:twit@ds053798.mongolab.com:53798/hackprinceton');

//setup mongoose
app.db = mongoose.createConnection(app.get('mongodb-uri'));
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  console.log('mongoose open for business');
});

// twitter
var Twitter = require('node-twit');

app.twitter = new Twitter.SearchClient(
    't7wKGltr13Zo7XYOrWu6VQ',
    '5vqcS29yzdX37aOKXwIQlf8cnUWJsY16KuwGvXl3NLw',
    '511314106-x9D3QfPQbhUUn0a8VrFULqhOmC2ELJPtXQDC1Uov',
    'TgVYnP8ByBagzWG4mxTfP8gqcRAsAbAkLXbHmeKILKqqh'
);

// Import data models
require('./models')(app, mongoose);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({
	secret: config.db.sessionSecret,
	maxAge: new Date(Date.now() + 3600000),
	store: new MongoStore(config.db)
}));
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.methodOverride());
app.use(function(req, res, next){
  if(req.user){
    res.locals.user = req.user;
    if(req.user.provider == "google" && req.user.google.picture) {
      res.locals.user.image = req.user.google.picture;
    } else if(req.user.provider == "facebook") {
      res.locals.user.image = 'http://graph.facebook.com/' + req.user.facebook.username + '/picture';
    }     
    if(res.locals.user.image === undefined || res.locals.user.image == '') res.locals.user.image = '/images/avatar_default.jpg';
  }   
  next()
})
app.use(flash());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.commafy = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Import utilities and configure uri routing
require('./utilities')(app);
require('./lib/passport')(app, passport);
require('./routes')(app, passport);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
