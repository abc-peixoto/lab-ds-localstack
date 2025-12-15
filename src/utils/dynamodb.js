/**
 * DynamoDB utility functions
 */

const AWS = require("aws-sdk");

function localEndpoint() {
  const host = process.env.LOCALSTACK_HOSTNAME || "localhost";
  return `http://${host}:4566`;
}

const isLocal = process.env.STAGE === "local" || process.env.IS_OFFLINE === "true";

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || "us-east-1",
  ...(isLocal ? { endpoint: localEndpoint() } : {}),
});

function getTableName() {
  return process.env.ITEMS_TABLE;
}

module.exports = { dynamoDb, getTableName };

