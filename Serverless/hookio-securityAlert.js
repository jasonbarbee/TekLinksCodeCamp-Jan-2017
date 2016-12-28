module['exports'] = function myService (hook) {
  var text = '';
  var results;
if(hook.params.version == "VyOS") {
  text = "Security Alert - INFO: " + " IP:" + hook.params.ip + " Hostname:" + hook.params.hostname + " Version:" + hook.params.version + " violates security policy. Opening Connectwise Ticket.";
  // Whoa this is really serious. We have strict rules about this kind of thing.
  // Call Tropo IVR to call too..
  //https://api.tropo.com/1.0/sessions?action=create&token=754147586a6a6645646f664a77457378736f7364584d46786c4f44586870504d706c4543444764486277545a&numberToDial=2052495988&customerName=jeremy&msg=test
var troporequest = require('request');
troporequest({
    url: 'https://api.tropo.com/1.0/sessions',
    qs: {
      action: "create",
      token: "754147586a6a6645646f664a77457378736f7364584d46786c4f44586870504d706c4543444764486277545a",
      customerName: "JasonBarbee",
      numberToDial: "2517676234",
      msg: text
    	},
    method: 'GET',
    body: ''
}, function(error, response, body){
    if(error) {
        console.log(error);
        hook.res.write("Tropo Call Failed\n");
    } else {
        console.log(response.statusCode, body);
        hook.res.write("Tropo Call Successful\n");
    }
});


//Log this to Spark  
//Load the request module
var sparkrequest = require('request');
sparkrequest({
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
        hook.res.write("Spark Log Failed\n");
    } else {
        console.log(response.statusCode, body);
        hook.res.write("Spark Log Successful\n");
    }
});

}
 else {
    hook.res.write("No Security issues found\n");
 }
return hook.res.end(); 
};