var moment = require('moment-timezone')
console.log(moment().add(1034256, 'seconds').tz('America/Los_Angeles').format('dddd, MMMM Do YYYY, h:mm:ss a'))
