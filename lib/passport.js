/**
 * Module dependencies.
 */
var LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;  



exports = module.exports = function(app, passport) {


  var config = app.config.keys;
  console.log(config);
  /**
   * LocalStrategy
   *
   * This strategy is used to authenticate users based on a username and password.
   * Anytime a request is made to authorize an application, we must ensure that
   * a user is logged in before asking them to approve the request.
   */   
  passport.use(new LocalStrategy(
    function(username, password, done) {
      app.db.models.User.findOne({email: username, password: require('crypto').createHash('md5').update(password).digest("hex")}, function(err, user) {
        console.log(user);
        if(user) {
          console.log(user);
          done(null, user);
        } else {
          console.log(user);
          done(null, false, { message: 'Incorrect username or password' });
        }
      });
    }
  ));

  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      app.db.models.User.findOne({ 'facebook.id': profile.id }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          user = new app.db.models.User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'facebook',
            facebook: profile._json
          })
          user.save(function (err) {
            if (err) console.log(err)
            else {
              portfolio = new app.db.models.Portfolio();
              portfolio.owner = user._id;

              portfolio.save(function (err) {
                if (err) console.log(err)
                return done(err, user)
              });
            }
          })
        }
        else {
          return done(err, user)
        }
      })
    }
  ));

  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      app.db.models.User.findOne({ 'google.id': profile.id }, function (err, user) {
        if (!user) {
          user = new app.db.models.User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'google',
            google: profile._json
          })
          user.save(function (err) {
            if (err) console.log(err)
            else {
              portfolio = new app.db.models.Portfolio();
              portfolio.owner = user._id;

              portfolio.save(function (err) {
                if (err) console.log(err)
                return done(err, user)
              });
            }
          })
        } else {
          return done(err, user)
        }
      })
    }
  ));


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    app.db.models.User.findOne({_id: id}, function (err, user) {
      done(err, user);
    });
  });

}