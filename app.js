var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var keyboard = require('./router/keyboard');
var message = require('./router/message');


app.use(bodyParser.json());



app.get('/',function(req,res){
  console.log("hello");
});


app.use('/keyboard',keyboard);
app.use('/message',message);

app.listen(8080,function(){
  console.log('Connect 8080 port!')
});


module.exports = app;
