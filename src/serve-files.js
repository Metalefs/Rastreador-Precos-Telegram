const express = require('express');
const server = express();
server.use('/', express.static(__dirname + '/static'));

server.listen(8080);