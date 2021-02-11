var express = require('express');
var app = express();
var compression = require('compression');

app.use(compression());

app.use(express.static('/home/jason/www/annotate'));

app.listen(3413);

console.log("Running on 3413...");

