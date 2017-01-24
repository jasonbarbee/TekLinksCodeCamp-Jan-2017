module['exports'] = function myService (hook) {
  var text = '';
  var results = '';
  // console.log("Version " + hook.params.version);
  // console.log("Token " + hook.params.tropotoken);
  // console.log(hook.params);
  
if(hook.params.version == "VyOS") {
  text = "Hook.io - Security Alert: " + " IP:" + hook.params.ip + " Hostname:" + hook.params.hostname + " Version:" + hook.params.version + " violates security policy.";
  	console.log("About to Spark Log");
	//Log this to Spark  

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
          return hook.res.end("Spark Log Failed!\n");
      } else {
          console.log(response.statusCode, body);
          return hook.res.end("Spark Log Successful\n");
      }
  });

  console.log("About to send Tropo");
  // Let's make an IVR call to alert our staff.
request({
    url: 'https://api.tropo.com/1.0/sessions',
    qs: {
      action: 'create',
      token: hook.params.tropotoken,
      numberToDial: hook.params.numbertocall,
      msg: text
    	},
    method: 'GET',
    body: ''
}, function(error, response, body){
  console.log("entering Callback. " + response.statusCode);
    if(error) {
        console.log(error);
        return hook.res.write("Tropo Call Failed\n");
    } else {

          console.log("Tropo Results : " + response.statusCode);
          return hook.res.write(response.statusCode + " : Tropo Results\n");
    }
});
}
 else {
    return hook.res.end("No Security issues found\n");
 }
//return hook.res.end(results); 
};