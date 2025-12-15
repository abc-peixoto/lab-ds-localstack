/**
 * DynamoDB utility functions
 */

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  endpoint: process.env.IS_OFFLINE || process.env.STAGE === 'local'
    ? 'http://localhost:4566'
    : undefined,
  region: process.env.AWS_REGION || 'us-east-1'
});

const getTableName = () => {
  return process.env.ITEMS_TABLE || 'crud-sns-serverless-items-local';
};

module.exports = {
  dynamoDb,
  getTableName
};

