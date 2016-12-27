module['exports'] = function myService (hook) {
  var text = '';
if(hook.params.version == "VyOS") {
  text = "Security Check Failed - Non Cisco device detected!";
  // Whoa this is really serious. We have strict rules about this kind of thing.
  // Call Tropo IVR to call too..
}
 else {
    return hook.res.end("No Security issues found");
 }
  
//Log this to Spark  
    //Load the request module
var request = require('request');
request({
    url: 'https://hook.io/' + hook.params.hookname + '/sparklogger', //URL to hit
    qs: {
      bottoken: hook.params.bottoken, 
      roomid: hook.params.roomid,
      message: text
    	},
    method: 'GET',
    body: ''
}, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
      hook.res.end("Spark Alert Sent");
    }
});
   
};