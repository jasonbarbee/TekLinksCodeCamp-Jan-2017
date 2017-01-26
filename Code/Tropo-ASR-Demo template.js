var roomID="<INSERT YOUR ROOM KEY HERE";
var token="INSERT YOUR BEARER TOKEN HERE";
var awsAccessKey="INSERT YOUR AWS IAM USER ACCESS KEY HERE";
var awsAccessSecret="INSERT YOUR AWS IAM SECRET KEY HERE";
var tropoTokenURL="INSERT THE TOKEN URL FOR YOUR TROPO ASR DEMO APP HERE";

// leave trailing / on S3 URL
var awsS3BucketURL="INSERT YOUR AWS S3 BUCKET URL HERE";

// increment this with each edit to keep track of the version you are running at Tropo during testing
var version=1;

//
// Cisco Spark Logging Library for Tropo
//

//modified by Jeremy Sanders to use the messages API instead of incoming webhook

// Factory for the Spark Logging Library, with 3 parameters
//    - the name of the application will prefix all your logs, 
//    - the Bearer token
//    - the Room ID (to  which logs will be posted)
function SparkLog(appName, bearerToken, roomID) {
	
	if (!appName) {
		log("SPARK_LOG : bad configuration, no application name, exiting...");
		throw createError("SparkLibrary configuration error: no application name specified");
	}
        this.tropoApp = appName;

	if (!bearerToken) {
		log("SPARK_LOG : bad configuration, no Spark incoming integration URI, exiting...");
		throw createError("SparkLibrary configuration error: no Spark bearer token specified");
	}
        this.bearerToken = bearerToken;

    if (!roomID) {
		log("SPARK_LOG : bad configuration, no Spark room ID, exiting...");
		throw createError("SparkLibrary configuration error: no Spark room ID specified");
	}
        this.roomID = roomID; 
        
	log("SPARK_LOG: all set for application:" + this.tropoApp + ", posting to roomID: " + this.roomID);
}

// This function sends the log entry to the registered Spark Room 
// Invoke this function from the Tropo token-url with the "sparkIntegration" parameter set to the incoming Webhook ID you'll have prepared
// Returns true if the log entry was acknowledge by Spark (ie, got a 2xx HTTP status code)
SparkLog.prototype.log = function(newLogEntry, fileURL) {
	
    // Robustify
    if (!newLogEntry) {
    	newLogEntry = "";
    }
    
    var result;
    try {
        // Open Connection
        var url = "https://api.ciscospark.com/v1/messages";
        connection = new java.net.URL(url).openConnection();

        // Set timeout to 10s
        connection.setReadTimeout(10000);
        connection.setConnectTimeout(10000);

        // Method == POST
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("Accept", "application/json");
        connection.setRequestProperty("Authorization", "Bearer " + this.bearerToken);
        
        // TODO : check if this cannot be removed
        connection.setRequestProperty("Content-Length", newLogEntry.length);
        connection.setUseCaches (false);
        connection.setDoInput(true);
        connection.setDoOutput(true); 

        //Send Post Data
        bodyWriter = new java.io.DataOutputStream(connection.getOutputStream());
        log("SPARK_LOG: posting: " + newLogEntry + " to: " + url);
        logMessage = {
            roomId:this.roomID,
            markdown:this.tropoApp + ":" + newLogEntry
        }

        if (fileURL) {
            logMessage.files=[fileURL];
        }
        log("SPARK_LOG: message contents: " + JSON.stringify(logMessage));
        contents = JSON.stringify(logMessage);
        bodyWriter.writeBytes(contents);
        bodyWriter.flush ();
        bodyWriter.close (); 

        result = connection.getResponseCode();
        log("SPARK_LOG: read response code: " + result);

	if(result < 200 || result > 299) {
	        log("SPARK_LOG: could not log to Spark, message format not supported");
	        return false;
	 }
    }
    catch(e) {
        log("SPARK_LOG: could not log to Spark, socket Exception or Server Timeout");
        return false;
    }
    
    log("SPARK_LOG: log successfully sent to Spark, status code: " + result);
    return true; 
}

// Let's create several instances for various log levels
// Note that you may spread logs to distinct rooms by changing the integrationId
var SparkInfo = new SparkLog("Tropo ASR Demo", token, roomID);
//var SparkDebug = new SparkLog("SalesCampaign - DEBUG:","Y2lzY29zcGFyazovL3VzL1dFQkhPT0svOGIyOTk0MmItMWUwYS00Zjc4LWFiMWYtZGI4YTg0MzMyYjhk");

//
// Log Configuration happens here
//

// info level used to get a synthetic sump up of what's happing
function info(logEntry,fileURL) {
  log("INFO: " + logEntry);
  SparkInfo.log(logEntry, fileURL);
  // Uncomment if you opt to go for 2 distinct Spark Rooms for DEBUG and INFO log levels
  //SparkDebug.log(logEntry); 
}

/** debug level used to get detail informations
function debug(logEntry) {
  log("DEBUG: " + logEntry);
  SparkDebug.log(logEntry);
}
**/




// This starts the code for processing the actual requests
if (currentCall) {
    info("**Script starting with active caller at " + currentCall.callerID + "**");
    //info("currentCall-CLID=" + currentCall.callerID);
    //info("currentCall-session=" + currentCall.sessionId);
    callLeg = "inbound";
    //info(currentCall.methods());
}

var timecode=new Date().getTime();

// check if we have an inbound call or if the call is coming from a transcription result
if (callLeg=="inbound") {
    //check to see if the inbound call leg is an SMS or Voice call
    if (currentCall.network=="SMS") {
        // process various commands sent via SMS
        if (currentCall.initialText.slice(0,10)=="/newticket") {
            info("Caller " + currentCall.callerID + " requested a new ticket be created for the following problem description.\n * " + currentCall.initialText.slice(11,currentCall.initialText.length()));
            say("New service ticket created. A customer service representative will contact you shortly.");
        } else if (currentCall.initialText.slice(0,9)=="/custserv") {
            info("Caller " + currentCall.callerID + " requested a callback.");
            say("A customer service representative will contact you shortly.");
        } else {
            say("To report a new problem enter \"/newticket [enter problem description here]\". To request a callback enter \"/custserv\".");
        }
    } else {
        info("Call from " + currentCall.callerID);
        say("version " + version);
        ask("Thank you for calling XYZ Widgets. To report a new problem say, new ticket. For network emergencies say, customer service.", 
        {
            choices:"new ticket, customer service",
            onChoice: function(event) {
                if (event.value=="new ticket"){
                    info("Caller " + currentCall.callerID + " selected New Ticket");
                    say("you said new ticket");
                    var recording=record("Leave a detailed message describing your problem?", {
                        asyncUpload: true,
                        recordURI: awsS3BucketURL + currentCall.callerID + "-newticket-" + timecode + ".mp3",
                        recordFormat: "audio/mp3",
                        recordMethod: "s3",
                        recordPassword: awsAccessSecret,
                        recordUser: awsAccessKey,
                        terminator: "#",
                        transcriptionOutURI: tropoTokenURL & "&callLeg=transcription",
                        transcriptionID: currentCall.callerID,
                        onError: function(event) {
                            say("error with recording");
                        },
                        onRecord: function(event) {
                            var recResult="newticket";
                            info("Caller " + currentCall.callerID + " message recording", awsS3BucketURL + currentCall.callerID + "-" + recResult + "-" + timecode + ".mp3");
                        }
                    });

                    say ("A customer support representative will return your call shortly.");

                } else if (event.value=="customer service") {
                    info("Caller " + currentCall.callerID + " selected customer service");
                    say("you said customer service, transferring now");
                    transfer("sip:jsanders@teklinks.com", {
                        onSuccess: function(event) {
                            info("Caller " + currentCall.callerID + " successfully connected to customer service at sip:jsanders@teklinks.com");
                        },
                        onCallFailure: function(event) {
                            record("Customer service is not available at this time. Leave a detailed message describing your problem?", {
                                asyncUpload: true,
                                recordURI: awsS3BucketURL + currentCall.callerID + "-customerservice-" + timecode + ".mp3",
                                recordFormat: "audio/mp3",
                                recordMethod: "s3",
                                recordPassword: awsAccessSecret,
                                recordUser: awsAccessKey,
                                terminator: "#",
                                transcriptionOutURI: tropoTokenURL & "&callLeg=transcription",
                                transcriptionID: currentCall.callerID,
                                onError: function(event) {
                                    say("error with recording");
                                },
                                onRecord: function(event) {
                                    var recResult="customerservice";
                                    info("Caller " + currentCall.callerID + " message recording", awsS3BucketURL + currentCall.callerID + "-" + recResult + "-" + timecode + ".mp3");
                                }
                            });
                        }
                    });            
                }
            }
        });
        
        
        say("goodbye");
        info("Caller " + currentCall.callerID + " call complete");
        hangup();
    }

} else if (callLeg=="transcription") {
    //transcription result
    log("DEBUGLOG: " + result);
    var resultJSON = JSON.parse(result);
    if (resultJSON){
        info("**Caller " + resultJSON.identifier + " requested a new ticket be created for the following problem description.**\n * " + resultJSON.transcription);
    }
    
} else {
    info("no valid call leg");
}

