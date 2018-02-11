
exports.getApi = function(url){
	var request = require('sync-request');
	var res = request('GET', url);
	res =  res.getBody('utf8');
	res = JSON.parse(res);
	return res;

}

exports.postApi = function(url,payload){
	var crypto = require('crypto');
	var request = require('sync-request');
	var config = require('../config/config.json');
	var result;
	var ACCESS_TOKEN = config.ACCESS_TOKEN;
	var SECRET_KEY = config.SECRET_KEY;
	var url = 'https://api.coinone.co.kr/v2/'+url;
	  
	payload = new Buffer(JSON.stringify(payload)).toString('base64');

	var signature = crypto
	  .createHmac("sha512", SECRET_KEY.toUpperCase())
	  .update(payload)
	  .digest('hex');

	var headers = {
	  'content-type':'application/json',
	  'X-COINONE-PAYLOAD': payload,
	  'X-COINONE-SIGNATURE': signature
	};

	var options = {
	  headers: headers,
	  body: payload
	};

	var res = request('POST',url,options);  //sync http request
	res = JSON.parse(res.getBody('utf8'));

	return res;
}

exports.getErrorMessage = function(errorCode){
	if(errorCode == 0){
		message =  "요청이 성공하였습니다\n";
	}


	else{
		//failed
		if(errorCode == 4){
			message =  "차단 된 사용자 액세스\n";
		}
		else if(errorCode == 11){
			message =  "액세스 토큰이 누락되었습니다.\n";
		}
		else if(errorCode == 12){
			message =  "잘못된 액세스 토큰\n";
		}
		else if(errorCode == 40){
			message =  "잘못된 API 권한\n";
		}
		else if(errorCode == 50){
			message =  "인증 오류\n";
		}
		else if(errorCode == 51){
			message =  "차단 된 사용자 액세스\n";
		}
		else if(errorCode == 52){
			message =  "차단 된 사용자 액세스\n";
		}
		else if(errorCode == 53){
			message =  "차단 된 사용자 액세스\n";
		}
		else if(errorCode == 100){
			message =  "차단 된 사용자 액세스\n";
		}
		else if(errorCode == 101){
			message =  "형식이 잘못되었습니다.\n";
		}
		else if(errorCode == 102){
			message =  "ID가 존재하지 않습니다.\n";
		}
		else if(errorCode == 103){
			message =  "잔액 부족\n";
		}
		else if(errorCode == 104){
			message =  "주문 ID가 없습니다.\n";
		}
		else if(errorCode == 105){
			message =  "가격이 올바르지 않습니다.\n";
		}

		else if(errorCode == 106){
			message =  "잠금 오류\n";
		}
		else if(errorCode == 107){
			message =  "매개 변수 오류\n";
		}
		else if(errorCode == 111){
			message =  "주문 ID가 없습니다.\n";
		}
		else if(errorCode == 112){
			message =  "취소 실패\n";
		}
		else if(errorCode == 113){
			message =  "수량이 너무 적습니다 (ETH, ETC> 0.01)\n";
		}
		///add other error 
	}

	return message;
}