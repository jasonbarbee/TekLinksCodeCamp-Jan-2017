module['exports'] = function myService (hook) {
  var text = '';
  var results = '';
if(hook.params.version == "VyOS") {
  text = "Security Alert - INFO: " + " IP:" + hook.params.ip + " Hostname:" + hook.params.hostname + " Version:" + hook.params.version + " violates security policy. Opening Connectwise Ticket.";
  // Whoa this is really serious. We have strict rules about this kind of thing.
  // Call Tropo IVR to call too..
console.log("About to Spark Log");
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
        return hook.res.end("Spark Log Failed!\n");
    } else {
        console.log(response.statusCode, body);
        return hook.res.end("Spark Log Successful\n");
    }
});

  // Let's make an IVR call to alert our staff.
request({
    url: 'https://api.tropo.com/1.0/sessions',
    qs: {
      action: 'create',
      token: '754147586a6a6645646f664a77457378736f7364584d46786c4f44586870504d706c4543444764486277545a',
      customerName: hook.params.customername,
      numberToDial: hook.params.numbertocall,
      msg: text
    	},
    method: 'GET',
    body: ''
}, function(error, response, body){
    if(error) {
        console.log(error);
        return hook.res.write("Tropo Call Failed\n");
    } else {
        console.log(response.statusCode, body);
        return hook.res.write("Tropo Call Successful\n");
    }
});
}
 else {
    return hook.res.end("No Security issues found\n");
 }
//return hook.res.end(results); 
};