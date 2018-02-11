var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var api = require('../api/api');
var config = require('../config/config.json');

var ACCESS_TOKEN = config.ACCESS_TOKEN;


router.post('/',function(req,res){
	var coinList = ["ltc","btc","bch","qtum","iota","btg","xrp","eth","etc"];
	var reqText = "";
	const _obj = {
        user_key: req.body.user_key,
        type: req.body.type,
        content: req.body.content
    }; // response by kakao API (user input)

    if(_obj.content == "명령어"){
    	reqText =  "!잔고확인\n";    	
    	reqText += "!가상계좌\n";
    	reqText += "!구매\n==>[!구매 500000 0.1 btc]";
    	reqText += "!판매\n==>[!판매 500000 0.1 btc]";
    	reqText += "!시세\n";

    }

    else if(_obj.content.indexOf('!잔고확인') != -1){

    	let payload = {
	  		"access_token": ACCESS_TOKEN,
			"nonce": Date.now()
		};


    	result = api.postApi('/account/balance',payload);
    	// need to modify to use loop... 
    	reqText = "ltc[avail : "+(result.ltc.avail)+" , balance :"+(result.ltc.balance)+"]\n";
    	reqText += "btc[avail : "+(result.btc.avail)+" , balance :"+(result.btc.balance)+"]\n";
    	reqText += "bch[avail : "+(result.bch.avail)+" , balance :"+(result.bch.balance)+"]\n";
    	reqText += "qtum[avail : "+(result.qtum.avail)+" , balance :"+(result.qtum.balance)+"]\n";
    	reqText += "iota[avail : "+(result.iota.avail)+" , balance :"+(result.iota.balance)+"]\n";
    	reqText += "btg[avail : "+(result.btg.avail)+" , balance :"+(result.btg.balance)+"]\n";
    	reqText += "xrp[avail : "+(result.xrp.avail)+" , balance :"+(result.xrp.balance)+"]\n";
    	reqText += "eth[avail : "+(result.eth.avail)+" , balance :"+(result.eth.balance)+"]\n";
    	reqText += "krw[avail : "+(result.krw.avail)+" , balance :"+(result.krw.balance)+"]\n";
    }
	


    else if(_obj.content.indexOf('!가상계좌') != -1){
    	let payload = {
	  		"access_token": ACCESS_TOKEN,
			"nonce": Date.now()
		};
    	result = api.postApi('/account/virtual_account',payload);
    	if(result.bankName == ''){
    		reqText = "가상계좌 발급이 필요합니다."
    	}
    	else{
    		reqText = result.bankName+' '+result.accountNumber;
    	}
    }
    else if(_obj.content.indexOf('!지갑주소') != -1){
    	let payload = {
	  		"access_token": ACCESS_TOKEN,
			"nonce": Date.now()
		};

    	result = api.postApi('/account/deposit_address',payload);
    	reqText = "ltc : "+(result.walletAddress.ltc)+"\n";
    	reqText += "btc : "+(result.walletAddress.btc)+"\n";
    	reqText += "bch : "+(result.walletAddress.bch)+"\n";
    	reqText += "qtum : "+(result.walletAddress.qtum)+"\n";
    	reqText += "iota : "+(result.walletAddress.iota)+"\n";
    	reqText += "btg : "+(result.walletAddress.btg)+"\n";
    	reqText += "xrp : "+(result.walletAddress.xrp)+"\n";
    	reqText += "eth : "+(result.walletAddress.eth)+"\n";
    }

    else if((_obj.content.indexOf('!구매') != -1 || _obj.content.indexOf('!판매') != -1) && _obj.content.match(/ /g).length == 3){
    	let strArr = _obj.content.split(" ");
    	let price = Number(strArr[1]);
    	let qty = Number(strArr[2]);
    	let currency = strArr[3];
    	var payload = {
		  "access_token": ACCESS_TOKEN,
		  "price": price,
		  "qty": qty,
		  "currency": currency,
		  "nonce": Date.now()
		};
		
		let url = strArr[0].indexOf('!구매') != -1 ? 'limit_buy' : 'limit_sell';

    	result = api.postApi('/order/'+url,payload);
    	errorCode = result.errorCode;
    	reqText = api.getErrorMessage(errorCode);
		
    }

    else if(_obj.content.indexOf('!시세') != -1){
    	for(var i=0; i<coinList.length; i++){
    		//all coin by coinone 24H / 24L / NOW 
    		result = api.getApi("https://api.coinone.co.kr/ticker?currency="+coinList[i]);
    		reqText += coinList[i]+"[24L :"+result.low+" / 24H :"+result.high+"]\n   NOW =>["+result.last+"]\n";
    	}
    }


    let message = {
        "message": {
            "text": reqText
        },
        "keyboard": {
            "type": "buttons",
            "buttons": [
                "명령어",
                "!시세",
            ]
        }
    };
    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify(message)); 


});



module.exports = router;
