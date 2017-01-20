'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.hostname !== 'string') {
    console.error('Validation Failed'); // eslint-disable-line no-console
    callback(new Error('Couldn\'t create the router'));
    return;
  }

  const params = {
    TableName: 'routers',
    Item: {
      id: uuid.v1(),
      hostname: data.hostname,
      ip: data.ip,
      os: data.os,
      version: data.version,
      customer: data.customer,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // Push a SNS message for Security Scanning Pipeline
  const sns = new AWS.SNS();
  const accountId = '062829191412';

  const snsparams = {
    Message: JSON.stringify({
          hostname: data.hostname,
          ip: data.ip,
          os: data.os,
          version: data.version,
          customer: data.customer,
    }),
    TopicArn: `arn:aws:sns:us-east-1:${accountId}:securityscan`,
  };

  sns.publish(snsparams, (error, data) => {
    if (error) {
      callback(error);
    }
  });

  // write the todo to the database
  dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error); // eslint-disable-line no-console
      callback(new Error('Couldn\'t create router.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Router),
    };
    callback(null, response);
  });
};
