'use strict';

const AWS = require('aws-sdk');
require('dotenv').config();

module.exports.securityscan = (event, context, callback) => {
  const sns = new AWS.SNS();
  const accountId = process.env.ACCOUNT_ID;
  var Message = JSON.parse(event.Records[0].Sns.Message);
  console.log("New Inventory Found with OS:" + Message.os);
  if(Message.os == "VyOS") {  
    var text = "AWS API Security Alert - " + " IP:" + Message.ip + " Hostname:" + Message.hostname + " Version:" + Message.version + " violates security policy.";
    const params = {
        Message: JSON.stringify({
          text: text,
          hostname: Message.hostname,
          ip: Message.ip,
          os: Message.os,
          version: Message.version,
          customer: Message.customer,
        }),
        TopicArn: `arn:aws:sns:us-east-1:${accountId}:securityalert`
        };
    // Push an Alert message to the SNS queue for Spark and Tropo.
    sns.publish(params, (error, data) => {
      if (error) {
        callback(error);
      }
      // print out the event information on the console (so that we can see it in the CloudWatch logs)
      //console.log(`Dump of new item "routers":\n${JSON.stringify(event, null, 2)}`);
      
      callback(null, { message: 'queued message to security alert', event });
    });
  }
  else {
     callback(null, { message: 'Router passed Security Checkpoint', event });
  }
};

module.exports.sparkalert = (event, context, callback) => {
  // print out the event information on the console (so that we can see it in the CloudWatch logs)
  // console.log(`This will call and text you:\n${JSON.stringify(event, null, 2)}`);
  console.log("About to Spark Log room " + process.env.SPARKROOM + JSON.stringify(event.Records[0].Sns.Message));
  var request = require('request');
  var body = {"roomId": process.env.SPARKROOM , "text": JSON.parse(event.Records[0].Sns.Message).text};
  var postReq = {
            url: "https://api.ciscospark.com/v1/messages",
            method: "POST",
            headers: {
                    'Accepts': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': "Bearer " + process.env.BOTTOKEN
                    },
      		json: body,
            };
	
    request.post(postReq,function(err, res, body){
  
    if (err) {
      console.log("Error", err.message);
      callback(null, { message: err.message }, { event });
    }
      //Check for right status code
    if(res.statusCode !== 200){
        console.log('Invalid Status Code Returned:', res.statusCode);
      callback(null, {message: "Spark API Error " + res.statusCode }, { event });
    }

    //All is good. Print the body
    callback(null, { message : "Spark Message Sent" }, { event });
    });
};


module.exports.tropoalert = (event, context, callback) => {
  // print out the event information on the console (so that we can see it in the CloudWatch logs)
  // console.log(`This will call and text you:\n${JSON.stringify(event, null, 2)}`);
  console.log("About to send to Tropo " + JSON.stringify(event.Records[0].Sns.Message));
  var request = require('request');
  var Message = JSON.parse(event.Records[0].Sns.Message);
  console.log("Message is " + Message.text + " to " + process.env.ADMINCELL);
  request({
      url: 'https://api.tropo.com/1.0/sessions',
      qs: {
        action: 'create',
        token: process.env.TROPOTOKEN,
        customerName: Message.customer,
        numberToDial: process.env.ADMINCELL,
        msg: Message.text
        },
      method: 'GET',
      body: ''
      }, function(err, res, body){
    if (err) {
      console.log("Error", err.message);
      callback(err, { message: err.message }, { event });
    }
      //Check for right status code
    if(res.statusCode !== 200){
        console.log('Invalid Status Code Returned:', res.statusCode);
      callback(err, { message: "Tropo API Error " + res.statusCode }, { event });
    }

    //All is good. Print the body
    console.log("Status Code 200 - Tropo Received it");
    callback(null, { message : "Tropo Call Sent" }, { event });
    });
};