
/**
 * Module dependencies.
 */
var crypto = require('crypto');

exports = module.exports = function(app) {
  //create utility object in app
  app.utility = {};
  
  // get config
  var konphyg = require('konphyg')(__dirname + '/conf');
  var config = konphyg.all();
  app.config = config;


  //setup utilities
  app.utility.email = require('./utilities/email');
  app.logger = require('./utilities/logger');
  app.utility.uid = uid;
  app.utility.getRandomInt = getRandomInt;

}

/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
function uid(len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

/**
 * Retrun a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
