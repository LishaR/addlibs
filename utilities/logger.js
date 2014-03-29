var winston = require('winston');

// setup logging
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)()
    ]
  });

exports = module.exports = logger;