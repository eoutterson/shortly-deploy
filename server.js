var app = require('./server-config.js');

// var port = process.env.PORT;
var port = 8888;

app.listen(port);

console.log('Server now listening on port ' + port);
