# Serverless REST API for Router Inventory and Security

This example demonstrates how to setup a [RESTful Web Services](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) allowing you to create, list, get, update and delete routers. DynamoDB is used to store the data. This is just an example and of course you could use any data storage as a backend.

## Structure

This service has a separate directory for all the router operations. For each operation exactly one file exists e.g. `routers/delete.js`. In each of these files there is exactly one function which is directly attached to `module.exports`. In order for the Serverless framework to have access to these functions one `routers/index.js` exists which is importing and than exporting all the operations as one module.

The idea behind the `routers` directory is that in case you want to create a service containing multiple resources e.g. users, notes, comments you could do so in the same service. While this is certainly possible you might consider creating a separate service for each resource. It depends on the use-case and your preference.


## Credentials
create a .env file with information relevant to AWS, Spark and Tropo
ACCOUNT_ID=
BOTTOKEN=
SPARKROOM=
ADMINCELL=
TROPOTOKEN=

ACCOUNT_ID is your AWS ID found in your AWS console under "My Account"
BOTTOKEN is your Spark Authentication token
SPARKROOM is the room you want to post to
TROPOTOKEN is your outbound enabled Tropo account.
ADMINCELL is your cell phone Tropo will call.

## Setup

```bash
npm install
```

## Deploy

In order to deploy the you endpoint simply run

```bash
serverless deploy
```

The expected result should be similar to:

```bash
Serverless: Packaging service…
Serverless: Uploading CloudFormation file to S3…
Serverless: Uploading service .zip file to S3…
Serverless: Updating Stack…
Serverless: Checking Stack update progress…
Serverless: Stack update finished…

Service Information
service: serverless-rest-api-with-dynamodb
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  POST - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/routers
  GET - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/routers
  GET - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/routers/{id}
  PUT - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/routers/{id}
  DELETE - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/routers/{id}
functions:
  serverless-rest-api-with-dynamodb-dev-update: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-update
  serverless-rest-api-with-dynamodb-dev-get: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-get
  serverless-rest-api-with-dynamodb-dev-list: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-list
  serverless-rest-api-with-dynamodb-dev-create: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-create
  serverless-rest-api-with-dynamodb-dev-delete: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-delete
```

## Usage

You can create, retrieve, update, or delete routers with the following commands:

### Create a router

POST https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/routers 
{
    "customer" : "Jason",
    "ip" : "1.1.1.1",
    "os" : "VyOS",
    "hostname" : "VyOS Router",
    "version" : "12.2",
    "securitycheck" : "true"
}

No output

### List all routers

```bash
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/routers
```

### Get one Router

```bash
# Replace the <id> part with a real id from your routers table
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/routers/<id>
```


### Update a router


# Replace the <id> part with a real id from your routers table
PUT https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/routers/<id> 
{
    "customer" : "Jason",
    "ip" : "1.1.1.1",
    "os" : "VyOS",
    "hostname" : "VyOS Router",
    "version" : "12.2",
    "securitycheck" : "true"
}

No output

### Delete a router

```bash
# Replace the <id> part with a real id from your routers table
curl -X DELETE https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/routers/<id>
```

No output

