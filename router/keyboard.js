var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var config = require('../config/config.json');
var api = require('../api/api');

router.get('/',function(req,res){ //keyboard initialize
	let keyboard = {
    "type" : "buttons",
    "buttons" : ["명령어"]
  };
  res.send(keyboard);

  //console.log(result);
  //result = (api.accountV2('deposit_address'));
  //console.log(result.walletAddress.xrp);
});


module.exports = router;
