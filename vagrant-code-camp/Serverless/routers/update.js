'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.hostname !== 'string') {
    console.error('Validation Failed - Router must have a hostname'); // eslint-disable-line no-console
    callback(new Error('Couldn\'t update the router.'));
    return;
  }

  const params = {
    TableName: 'routers',
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeValues: {
      ':hostname': data.hostname,
      ':ip': data.ip,
      ':os': data.os,
      ':version': data.version,
      ':updatedAt': timestamp,
      ':customer': data.customer,
    },
    UpdateExpression: 'SET customer = :customer, version = :version, hostname = :hostname, ip = :ip, , os = :os, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the router in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error); // eslint-disable-line no-console
      callback(new Error('Couldn\'t update the router.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
