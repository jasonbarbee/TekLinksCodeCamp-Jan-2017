module['exports'] = function simpleHttpRequest (hook) {
  // npm modules available, see: http://hook.io/modules
    var request = require('request');
	var botToken= hook.params.bottoken;
  	var roomId= hook.params.roomid;
  	var text= hook.params.message;
  	var body={"roomId": roomId , "text": text};
    var postReq = {
            url: "https://api.ciscospark.com/v1/messages",
            method: "POST",
            headers: {
                    'Accepts': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': "Bearer " + botToken
                    },
      		json: body,
            };
	
    request.post(postReq,function(err, res, body){
  
    if (err) {
      console.log("Error", err.message);
      return hook.res.end(err.message);
    }
      //Check for right status code
    if(res.statusCode !== 200){
        console.log('Invalid Status Code Returned:', res.statusCode);
      return hook.res.end("Spark API Error " + res.statusCode);
    }

    //All is good. Print the body
      return hook.res.end("Spark Message Sent");
    });

};