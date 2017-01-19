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
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};
